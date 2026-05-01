import mongoose, { Connection, Types } from 'mongoose';
import Tenant, { ITenant } from '../models/tenant.model';

const MONGO_URI = process.env.MONGO_URI || '';
const DEFAULT_TENANT_SLUG = process.env.DEFAULT_TENANT_SLUG || 'default';

function parseDbNameFromUri(uri: string) {
  try {
    const url = new URL(uri);
    const pathname = url.pathname || '';
    return pathname.replace(/^\//, '') || 'admin';
  } catch {
    return 'admin';
  }
}

function normalizeDbName(value: string) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const DEFAULT_DB_NAME = process.env.DEFAULT_DB_NAME || parseDbNameFromUri(MONGO_URI);
const tenantConnections = new Map<string, Connection>();

export const getTenantConnection = (tenant: ITenant) => {
  if (!tenant) {
    throw new Error('Tenant is required to resolve connection');
  }

  const key = tenant._id.toString();
  if (tenantConnections.has(key)) {
    return tenantConnections.get(key)!;
  }

  const rawName = tenant.dbName || tenant.tenantId || tenant.slug;
  const dbName = normalizeDbName(rawName);
  const connection = mongoose.connection.useDb(dbName, { useCache: true });
  tenantConnections.set(key, connection);
  return connection;
};

export const findTenant = async (options: { tenantId?: string; tenantSlug?: string; email?: string }) => {
  if (options.email) {
    const byEmail = await Tenant.findOne({ email: options.email });
    if (byEmail) return byEmail;
  }

  if (options.tenantId) {
    const byTenantId = await Tenant.findOne({ tenantId: options.tenantId });
    if (byTenantId) return byTenantId;

    if (Types.ObjectId.isValid(options.tenantId)) {
      const byObjectId = await Tenant.findById(options.tenantId);
      if (byObjectId) return byObjectId;
    }
  }

  if (options.tenantSlug) {
    return await Tenant.findOne({ slug: options.tenantSlug });
  }

  return null;
};

export const getDefaultTenant = async () => {
  let tenant = await Tenant.findOne({ slug: DEFAULT_TENANT_SLUG });
  if (!tenant) {
    tenant = await Tenant.create({
      tenantId: '0000',
      name: 'Default Tenant',
      slug: DEFAULT_TENANT_SLUG,
      dbName: DEFAULT_DB_NAME,
      settings: {},
    });
    return tenant;
  }

  if (!tenant.tenantId) {
    tenant.tenantId = '0000';
  }
  if (!tenant.dbName) {
    tenant.dbName = DEFAULT_DB_NAME;
  }
  await tenant.save();
  return tenant;
};

export const resolveTenant = async (options: { tenantId?: string; tenantSlug?: string }) => {
  const tenant = await findTenant(options);
  if (tenant) return tenant;
  if (!options.tenantSlug && !options.tenantId) {
    return await getDefaultTenant();
  }
  return null;
};
