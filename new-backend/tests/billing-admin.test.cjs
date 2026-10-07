// Run with: node --test tests/billing-admin.test.cjs
const { test, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, filename);
const stub = (path, exports) => { require.cache[require.resolve(path)] = { id: require.resolve(path), filename: require.resolve(path), loaded: true, exports }; };
const Tenant = { findOne: mock.fn(), findOneAndUpdate: mock.fn() };
const userModel = { getUserModel: mock.fn() };
stub('../src/models/tenant.model.ts', { __esModule: true, default: Tenant });
stub('../src/config/tenant.ts', { getTenantConnection: mock.fn() });
stub('../src/models/user.model.ts', userModel);
const { getTenantAccessState, ensureDefaultSubscriptionPlans } = require('../src/services/subscription.service.ts');
const Plan = require('../src/models/subscription-plan.model.ts').default;
const { parsePlanInput, adminExtendTenant } = require('../src/controllers/billing-admin.controller.ts');
const { requireBillingAdmin, canManageBilling } = require('../src/middlewares/billing-admin.middleware.ts');
const identity = { tenantId: '0001', id: '507f1f77bcf86cd799439011', role: 'admin' };
const originalAllowlist = process.env.BILLING_ADMIN_USERS;
beforeEach(() => {
  process.env.BILLING_ADMIN_USERS = `0001:${identity.id}`;
  Tenant.findOne.mock.resetCalls(); Tenant.findOneAndUpdate.mock.resetCalls();
  Tenant.findOne.mock.mockImplementation(async () => ({ tenantId: '0001' }));
  userModel.getUserModel.mock.mockImplementation(() => ({ findOne: async () => ({ isActive: true }) }));
});
afterEach(() => { if (originalAllowlist === undefined) delete process.env.BILLING_ADMIN_USERS; else process.env.BILLING_ADMIN_USERS = originalAllowlist; });
const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
test('unlisted admin/super-admin and public client identities cannot access any admin route', async () => {
  for (const user of [undefined, { ...identity, role: 'super_admin', id: 'other' }, { ...identity, tenantId: '0002' }, { ...identity, type: 'public_client' }]) {
    const res = response(); const next = mock.fn();
    await requireBillingAdmin({ user }, res, next);
    assert.equal(res.statusCode, 403); assert.equal(next.mock.calls.length, 0);
  }
  assert.equal(Tenant.findOne.mock.calls.length, 0);
});
test('active allowlisted user has access; disabled users and missing tenants do not', async () => {
  assert.equal(await canManageBilling(identity), true);
  userModel.getUserModel.mock.mockImplementation(() => ({ findOne: async () => null }));
  assert.equal(await canManageBilling(identity), false);
  Tenant.findOne.mock.mockImplementation(async () => null);
  assert.equal(await canManageBilling(identity), false);
});
test('tenant extensions use atomic stacking, literal reasons, and leave payment dates untouched', async () => {
  Tenant.findOneAndUpdate.mock.mockImplementation(async () => ({ tenantId: '0002', subscription: { status: 'expired' }, accessExtendedUntil: new Date(Date.now() + 86400000) }));
  const res = response();
  await adminExtendTenant({ user: identity, params: { tenantId: '0002' }, body: { days: 7, reason: '$support grant' } }, res);
  assert.equal(res.statusCode, 200); assert.equal(res.body.access.hasFullAccess, true);
  const [filter, pipeline] = Tenant.findOneAndUpdate.mock.calls[0].arguments;
  assert.deepEqual(filter, { tenantId: '0002', status: 'active' });
  assert.deepEqual(pipeline[1].$set.accessExtensions.$concatArrays[1][0].reason, { $literal: '$support grant' });
  assert.equal(pipeline[0].$set.accessExtendedUntil.$add[1], 7 * 86400000);
  assert.equal(JSON.stringify(pipeline).includes('nextBillingAt'), false);
});
test('invalid extension days and empty reasons are rejected before database write', async () => {
  for (const body of [0, -1, 1.5, 3651, '7'].map(days => ({ days, reason: 'support' })).concat([{ days: 7, reason: ' ' }])) {
    const res = response(); await adminExtendTenant({ params: { tenantId: '0002' }, body }, res); assert.equal(res.statusCode, 400);
  }
  assert.equal(Tenant.findOneAndUpdate.mock.calls.length, 0);
});
test('extension restores expired access and expires without altering billing state', () => {
  const tenant = { subscription: { status: 'expired', currentPeriodEnd: new Date('2020-01-01') }, accessExtendedUntil: new Date(Date.now() + 86400000) };
  assert.equal(getTenantAccessState(tenant).hasFullAccess, true); assert.equal(tenant.subscription.status, 'expired');
  // Simulate a gateway update replacing the subscription snapshot.
  tenant.subscription = { status: 'cancelled' };
  assert.equal(getTenantAccessState(tenant).hasFullAccess, true);
  tenant.accessExtendedUntil = new Date('2020-01-02'); assert.equal(getTenantAccessState(tenant).hasFullAccess, false);
});
test('default seeding never overwrites edited or deleted plans', async () => {
  const update = mock.method(Plan, 'updateOne', async () => ({}));
  try { await ensureDefaultSubscriptionPlans(); for (const call of update.mock.calls) { assert.equal(call.arguments[1].$set, undefined); assert.ok(call.arguments[1].$setOnInsert); } } finally { update.mock.restore(); }
});
test('custom plan codes validate and durations match billing interval', () => {
  const plan = { code: 'growth-2026', name: 'Growth', interval: 'quarterly', amount: 699, currency: 'INR', isActive: true };
  assert.equal(parsePlanInput(plan, true).durationInMonths, 3);
  for (const change of [{ amount: -1 }, { amount: 1.234 }, { interval: '__proto__' }, { currency: 'RS' }, { code: 'trial' }]) assert.throws(() => parsePlanInput({ ...plan, ...change }, true));
});
test('custom codes are accepted across plans, transactions and invoices', () => {
  const Invoice = require('../src/models/subscription-invoice.model.ts').default;
  const Transaction = require('../src/models/subscription-transaction.model.ts').default;
  for (const [model, field] of [[Plan, 'code'], [Invoice, 'planCode'], [Transaction, 'planCode']]) {
    assert.equal(model.schema.path(field).enumValues.length, 0);
  }
});
test('editing a gateway-backed plan preserves old terms and resets the new-purchase gateway ID', async () => {
  const { adminSavePlan } = require('../src/controllers/billing-admin.controller.ts');
  const plan = { code: 'growth', name: 'Growth', amount: 100, currency: 'INR', interval: 'monthly', description: '', razorpayPlanId: 'plan_old', save: async () => {} };
  const lookup = mock.method(Plan, 'findOne', async () => plan);
  try {
    const res = response();
    await adminSavePlan({ method: 'PATCH', params: { code: 'growth' }, body: { name: 'Growth', amount: 200, currency: 'INR', interval: 'monthly', isActive: true } }, res);
    assert.equal(res.statusCode, 200); assert.equal(plan.amount, 200); assert.equal(plan.razorpayPlanId, '');
    assert.deepEqual(plan.previousRazorpayPlanIds, ['plan_old']);
    assert.equal(plan.retiredGatewayPlans[0].amount, 100);
  } finally { lookup.mock.restore(); }
});
test('deleting plans creates a tombstone rather than removing gateway history', async () => {
  const { adminDeletePlan } = require('../src/controllers/billing-admin.controller.ts');
  const update = mock.method(Plan, 'findOneAndUpdate', async () => ({ code: 'growth' }));
  try {
    const res = response(); await adminDeletePlan({ params: { code: 'growth' } }, res);
    assert.equal(res.statusCode, 200);
    const [, change] = update.mock.calls[0].arguments;
    assert.equal(change.$set.isActive, false); assert.ok(change.$set.deletedAt instanceof Date);
    assert.equal(change.$unset, undefined);
  } finally { update.mock.restore(); }
});
