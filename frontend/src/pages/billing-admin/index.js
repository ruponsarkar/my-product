import React, { useCallback, useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Add, AdminPanelSettings, MoreTime } from "@mui/icons-material";
import { createAdminPlan, deleteAdminPlan, extendTenantAccess, getAdminPlans, getAdminTenants, getBillingAdminCapabilities, updateAdminPlan } from "../../api/services/subscription/billingAdminApi";
import { formatBillingDate } from "../../utils/billing";

const emptyPlan = { code: "", name: "", interval: "monthly", amount: "", currency: "INR", description: "", isActive: true };
const message = (error) => error.response?.data?.message || "Unable to complete this request. Please try again.";
const panel = { p: { xs: 2, md: 3 }, border: "1px solid #e2e8f0", borderRadius: 3, boxShadow: "none" };
const accessEnd = (tenant) => {
  const sub = tenant?.subscription || {};
  const values = [sub.accessExtendedUntil];
  if (sub.status === "trialing") values.push(sub.trialEndsAt);
  if (sub.status === "active") values.push(sub.currentPeriodEnd);
  const dates = values.map((value) => value ? new Date(value).getTime() : 0).filter(Number.isFinite);
  return Math.max(0, ...dates);
};

export default function BillingAdminPage() {
  const [capability, setCapability] = useState("loading");
  const [capabilityError, setCapabilityError] = useState("");
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState("");
  const [tenants, setTenants] = useState([]);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [tenantsError, setTenantsError] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [reload, setReload] = useState(0);
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [extending, setExtending] = useState(null);
  const [days, setDays] = useState("30");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [mutationError, setMutationError] = useState("");
  const [success, setSuccess] = useState("");

  const checkCapability = useCallback(async () => {
    setCapability("loading"); setCapabilityError("");
    try { const { data } = await getBillingAdminCapabilities(); setCapability(data.canManageBilling ? "allowed" : "forbidden"); }
    catch (error) { setCapabilityError(message(error)); setCapability("error"); }
  }, []);
  useEffect(() => { checkCapability(); }, [checkCapability]);
  const loadPlans = useCallback(async () => {
    setPlansLoading(true); setPlansError("");
    try { const { data } = await getAdminPlans(); setPlans(data); }
    catch (error) { setPlansError(message(error)); }
    finally { setPlansLoading(false); }
  }, []);
  useEffect(() => { if (capability === "allowed") loadPlans(); }, [capability, loadPlans]);
  useEffect(() => {
    if (capability !== "allowed") return;
    let current = true;
    setTenantsLoading(true); setTenantsError("");
    getAdminTenants(search, page).then(({ data }) => {
      if (current) { setTenants(data.tenants); setHasMore(data.hasMore); }
    }).catch((error) => { if (current) setTenantsError(message(error)); })
      .finally(() => { if (current) setTenantsLoading(false); });
    return () => { current = false; };
  }, [capability, search, page, reload]);

  const mutate = async (action, onSuccess, notice) => {
    setBusy(true); setMutationError(""); setSuccess("");
    try { await action(); onSuccess(); setSuccess(notice); }
    catch (error) { setMutationError(message(error)); }
    finally { setBusy(false); }
  };
  const closeDialogs = () => { if (!busy) { setEditor(null); setDeleting(null); setExtending(null); setMutationError(""); } };
  const savePlan = (event) => {
    event.preventDefault();
    const { originalCode, ...payload } = editor;
    payload.amount = Number(payload.amount);
    payload.name = payload.name.trim(); payload.currency = "INR";
    if (originalCode) delete payload.code;
    mutate(() => originalCode ? updateAdminPlan(originalCode, payload) : createAdminPlan(payload), () => { setEditor(null); loadPlans(); }, originalCode ? "Plan updated. New purchases will use these details." : "Plan created.");
  };
  const openEditor = (plan) => {
    setMutationError("");
    setEditor(plan ? { ...emptyPlan, ...Object.fromEntries(Object.keys(emptyPlan).map((key) => [key, plan[key] ?? emptyPlan[key]])), originalCode: plan.code } : { ...emptyPlan });
  };
  const previewDate = new Date(Math.max(Date.now(), accessEnd(extending)) + Number(days || 0) * 86400000);

  if (capability === "loading") return <Stack direction="row" spacing={2} alignItems="center" sx={{ p: 3 }}><CircularProgress size={24} /><Typography>Checking billing administration access…</Typography></Stack>;
  if (capability === "error") return <Alert severity="error" action={<Button onClick={checkCapability}>Retry</Button>}>{capabilityError}</Alert>;
  if (capability === "forbidden") return <Paper sx={panel}><AdminPanelSettings color="disabled" sx={{ fontSize: 40 }} /><Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>Restricted billing administration</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Only authorized platform administrators and designated users can manage plans and tenant access.</Typography></Paper>;

  return <Stack spacing={3} sx={{ maxWidth: 1400, mx: "auto", color: "#0f172a" }}>
    <Box><Chip size="small" label="Restricted administration" icon={<AdminPanelSettings />} sx={{ mb: 1.5 }} /><Typography variant="h4" component="h1" sx={{ fontWeight: 800, fontSize: { xs: 26, md: 32 } }}>Billing administration</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Manage the plan catalog and give individual tenants more time.</Typography></Box>
    {success && <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>}
    <Paper component="section" sx={panel}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}><Box><Typography variant="h6" component="h2" fontWeight={700}>Billing plans</Typography><Typography variant="body2" color="text.secondary">Price changes apply to new purchases. Existing subscriptions keep their payment terms.</Typography></Box><Button variant="contained" startIcon={<Add />} onClick={() => openEditor(null)} sx={{ alignSelf: "flex-start", whiteSpace: "nowrap", textTransform: "none", boxShadow: "none" }}>Add plan</Button></Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", sm: "none" }, mb: 1 }}>Swipe the table to see all details and actions.</Typography>
      {plansError ? <Alert severity="error" action={<Button onClick={loadPlans}>Retry</Button>}>{plansError}</Alert> : plansLoading ? <CircularProgress size={26} aria-label="Loading plans" /> : !plans.length ? <Alert severity="info">No billing plans yet. Add your first plan to make it available for purchase.</Alert> : <TableContainer><Table size="small" aria-label="Billing plans"><TableHead><TableRow><TableCell>Plan</TableCell><TableCell>Price / interval</TableCell><TableCell>Availability</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{plans.map((plan) => <TableRow key={plan.code}><TableCell sx={{ py: 2 }}><Typography fontWeight={700}>{plan.name}</Typography><Typography variant="caption" color="text.secondary">{plan.code}</Typography>{plan.description && <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>{plan.description}</Typography>}</TableCell><TableCell sx={{ whiteSpace: "nowrap" }}>{plan.currency} {Number(plan.amount).toLocaleString("en-IN")}<Typography variant="caption" display="block" color="text.secondary">{plan.interval}</Typography></TableCell><TableCell><Chip size="small" color={plan.isActive ? "success" : "default"} label={plan.isActive ? "Available" : "Hidden"} /></TableCell><TableCell align="right"><Stack direction="row" justifyContent="flex-end"><Button onClick={() => openEditor(plan)} aria-label={`Edit ${plan.name}`}>Edit</Button><Button color="error" onClick={() => { setMutationError(""); setDeleting(plan); }} aria-label={`Delete ${plan.name}`}>Delete</Button></Stack></TableCell></TableRow>)}</TableBody></Table></TableContainer>}
    </Paper>
    <Paper component="section" sx={panel}>
      <Typography variant="h6" component="h2" fontWeight={700}>Tenant access</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Extend access after expiry without changing the tenant’s payment schedule.</Typography>
      <Stack component="form" onSubmit={(event) => { event.preventDefault(); setSearch(query.trim()); setPage(1); setReload((value) => value + 1); }} direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}><TextField label="Search tenants" placeholder="Name, email, slug or tenant ID" value={query} onChange={(event) => setQuery(event.target.value)} size="small" sx={{ flex: 1, maxWidth: 520 }} /><Button type="submit" variant="outlined">Search</Button></Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", sm: "none" }, mb: 1 }}>Swipe the table to see access dates and extension actions.</Typography>
      {tenantsError ? <Alert severity="error" action={<Button onClick={() => setReload((value) => value + 1)}>Retry</Button>}>{tenantsError}</Alert> : tenantsLoading ? <CircularProgress size={26} aria-label="Loading tenants" /> : !tenants.length ? <Alert severity="info">No tenants found. Try another search.</Alert> : <TableContainer><Table aria-label="Tenant access" size="small"><TableHead><TableRow><TableCell>Tenant</TableCell><TableCell>Access</TableCell><TableCell>Access until</TableCell><TableCell align="right">Action</TableCell></TableRow></TableHead><TableBody>{tenants.map((tenant) => <TableRow key={tenant.tenantId}><TableCell sx={{ py: 2 }}><Typography fontWeight={700}>{tenant.name}</Typography><Typography variant="body2" color="text.secondary">{tenant.email || tenant.slug}</Typography><Typography variant="caption" color="text.secondary">{tenant.tenantId}</Typography></TableCell><TableCell><Chip size="small" color={tenant.access?.hasFullAccess ? "success" : "warning"} label={tenant.access?.hasFullAccess ? "Full access" : "Limited access"} />{tenant.status !== "active" && <Typography variant="caption" display="block" color="error">Tenant {tenant.status}</Typography>}</TableCell><TableCell sx={{ whiteSpace: "nowrap" }}><Typography variant="body2" fontWeight={700}>{accessEnd(tenant) ? formatBillingDate(accessEnd(tenant)) : "No active access period"}</Typography>{tenant.subscription?.accessExtendedUntil && <Typography variant="caption" color="text.secondary">Extension included</Typography>}</TableCell><TableCell align="right"><Button startIcon={<MoreTime />} disabled={tenant.status !== "active"} sx={{ whiteSpace: "nowrap", textTransform: "none" }} onClick={() => { setExtending(tenant); setDays("30"); setReason(""); setMutationError(""); }}>Extend access</Button></TableCell></TableRow>)}</TableBody></Table></TableContainer>}
      <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2 }}><Button disabled={page === 1 || tenantsLoading} onClick={() => setPage((value) => value - 1)}>Previous</Button><Typography variant="body2">Page {page}</Typography><Button disabled={!hasMore || tenantsLoading || !!tenantsError} onClick={() => setPage((value) => value + 1)}>Next</Button></Stack>
    </Paper>
    <Dialog open={!!editor} onClose={closeDialogs} fullWidth maxWidth="sm"><Box component="form" onSubmit={savePlan}><DialogTitle>{editor?.originalCode ? "Edit billing plan" : "Add billing plan"}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{mutationError && <Alert severity="error">{mutationError}</Alert>}{editor && <><TextField required label="Plan name" value={editor.name} onChange={(event) => setEditor({ ...editor, name: event.target.value })} inputProps={{ maxLength: 120 }} /><TextField required disabled={!!editor.originalCode} label="Plan code" helperText="Unique code using lowercase letters, numbers, hyphens or underscores." value={editor.code} onChange={(event) => setEditor({ ...editor, code: event.target.value })} inputProps={{ pattern: "[a-z0-9][a-z0-9_-]{0,63}", maxLength: 64 }} /><Stack direction={{ xs: "column", sm: "row" }} spacing={2}><TextField required type="number" label="Price" value={editor.amount} onChange={(event) => setEditor({ ...editor, amount: event.target.value })} inputProps={{ min: "0.01", max: "10000000", step: "0.01" }} fullWidth /><TextField label="Currency" value="INR" disabled helperText="Razorpay billing" sx={{ minWidth: 130 }} /></Stack><TextField select label="Billing interval" value={editor.interval} onChange={(event) => setEditor({ ...editor, interval: event.target.value })}>{["weekly", "monthly", "quarterly", "yearly"].map((interval) => <MenuItem key={interval} value={interval}>{interval[0].toUpperCase() + interval.slice(1)}</MenuItem>)}</TextField><TextField label="Description" multiline minRows={2} value={editor.description} onChange={(event) => setEditor({ ...editor, description: event.target.value })} inputProps={{ maxLength: 1000 }} /><FormControlLabel control={<Switch checked={editor.isActive} onChange={(event) => setEditor({ ...editor, isActive: event.target.checked })} />} label="Available for new purchases" /></>}</Stack></DialogContent><DialogActions sx={{ px: 3, pb: 2 }}><Button disabled={busy} onClick={closeDialogs}>Cancel</Button><Button type="submit" variant="contained" disabled={busy}>{busy ? "Saving…" : "Save plan"}</Button></DialogActions></Box></Dialog>
    <Dialog open={!!deleting} onClose={closeDialogs} fullWidth maxWidth="xs"><DialogTitle>Delete {deleting?.name}?</DialogTitle><DialogContent>{mutationError && <Alert severity="error" sx={{ mb: 2 }}>{mutationError}</Alert>}<Typography>This removes the plan from checkout. Existing subscriptions and billing history are preserved.</Typography></DialogContent><DialogActions><Button disabled={busy} onClick={closeDialogs}>Cancel</Button><Button color="error" variant="contained" disabled={busy} onClick={() => mutate(() => deleteAdminPlan(deleting.code), () => { setDeleting(null); loadPlans(); }, "Plan removed from checkout.")}>{busy ? "Deleting…" : "Delete plan"}</Button></DialogActions></Dialog>
    <Dialog open={!!extending} onClose={closeDialogs} fullWidth maxWidth="sm"><Box component="form" onSubmit={(event) => { event.preventDefault(); mutate(() => extendTenantAccess(extending.tenantId, { days: Number(days), reason: reason.trim() }), () => { setExtending(null); setReload((value) => value + 1); }, "Tenant access extended."); }}><DialogTitle>Extend tenant access</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{mutationError && <Alert severity="error">{mutationError}</Alert>}<Box><Typography fontWeight={700}>{extending?.name}</Typography><Typography variant="body2" color="text.secondary">{extending?.tenantId}</Typography></Box><TextField required label="Additional days" type="number" value={days} onChange={(event) => setDays(event.target.value)} inputProps={{ min: 1, max: 3650, step: 1 }} helperText="Added to the current access end date, or today if already expired." /><Box sx={{ p: 2, borderLeft: "3px solid #0284c7", bgcolor: "#f0f9ff" }}><Typography variant="overline" color="text.secondary">Estimated access until</Typography><Typography fontWeight={800} fontSize={20}>{Number(days) >= 1 && Number(days) <= 3650 ? formatBillingDate(previewDate) : "Enter a valid number of days"}</Typography><Typography variant="caption" color="text.secondary">Shown in your local timezone. The server confirms the final date.</Typography></Box><TextField required label="Reason for extension" multiline minRows={2} value={reason} onChange={(event) => setReason(event.target.value)} inputProps={{ maxLength: 500 }} helperText="Recorded for your administration history." /><Alert severity="info">This grants application access only. It does not delay charges or change the payment schedule.</Alert></Stack></DialogContent><DialogActions sx={{ px: 3, pb: 2 }}><Button disabled={busy} onClick={closeDialogs}>Cancel</Button><Button variant="contained" type="submit" disabled={busy || !reason.trim()}>{busy ? "Extending…" : "Confirm extension"}</Button></DialogActions></Box></Dialog>
  </Stack>;
}
