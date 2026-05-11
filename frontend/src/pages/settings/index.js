import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { getSettings, updateSettings } from "../../api/services/settings/settingsApi";

const defaultSettings = {
  orgInfo: {
    name: "",
    address: "",
    ownerName: "",
    contactEmail: "",
    contactPhone: "",
  },
  gst: {
    enabled: false,
    number: "",
    rate: "",
  },
  discount: {
    enabled: false,
    defaultPercent: "",
    maxPercent: "",
    notes: "",
  },
  terms: {
    text: "",
  },
  payments: {
    razorpay: {
      enabled: false,
      key: "",
      secret: "",
      accountId: "",
    },
    googlepay: {
      enabled: false,
      merchantId: "",
      upiId: "",
    },
    phonepay: {
      enabled: false,
      merchantId: "",
      upiId: "",
    },
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function SectionCard({ eyebrow, title, description, children }) {
  return (
    <Box className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {(eyebrow || title || description) ? (
        <Box className="mb-4">
          {eyebrow ? (
            <Typography className="!mb-1 !text-[11px] !font-semibold !uppercase !tracking-[0.24em] !text-sky-700">
              {eyebrow}
            </Typography>
          ) : null}
          {title ? (
            <Typography variant="h6" className="!mb-1 !font-semibold !text-slate-950">
              {title}
            </Typography>
          ) : null}
          {description ? (
            <Typography color="text.secondary" className="!text-sm">
              {description}
            </Typography>
          ) : null}
        </Box>
      ) : null}
      {children}
    </Box>
  );
}

function PaymentCard({ title, description, enabled, onToggle, children }) {
  return (
    <Box className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
      <Box className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <Box>
          <Typography variant="subtitle1" className="!font-semibold !text-slate-950">
            {title}
          </Typography>
          <Typography color="text.secondary" className="!mt-1 !text-sm">
            {description}
          </Typography>
        </Box>
        <FormControlLabel
          className="!m-0"
          control={<Switch checked={enabled} onChange={onToggle} />}
          label={enabled ? "Enabled" : "Disabled"}
          labelPlacement="start"
        />
      </Box>
      <Box className="space-y-3">{children}</Box>
    </Box>
  );
}

const mergeSettings = (base, patch) => ({
  ...base,
  ...patch,
  orgInfo: { ...base.orgInfo, ...patch.orgInfo },
  gst: { ...base.gst, ...patch.gst },
  discount: { ...base.discount, ...patch.discount },
  terms: { ...base.terms, ...patch.terms },
  payments: {
    razorpay: { ...base.payments.razorpay, ...patch.payments?.razorpay },
    googlepay: { ...base.payments.googlepay, ...patch.payments?.googlepay },
    phonepay: { ...base.payments.phonepay, ...patch.payments?.phonepay },
  },
});

export default function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getSettings();
      const loaded = response.data || {};
      setSettings(mergeSettings(defaultSettings, loaded));
    } catch (err) {
      console.error(err);
      setError("Unable to load settings. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFieldChange = (section, field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handlePaymentFieldChange = (provider, field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      payments: {
        ...prev.payments,
        [provider]: {
          ...prev.payments[provider],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await updateSettings(settings);
      setSettings(mergeSettings(defaultSettings, response.data || {}));
      setSuccess("Settings updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const sharedFieldProps = {
    fullWidth: true,
    size: "small",
  };

  return (
    <Box className="w-full px-4 py-4 sm:px-5 sm:py-5">
      <Box className="mb-4 rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.12),_transparent_36%),linear-gradient(135deg,#ffffff,rgba(248,250,252,0.95))] p-5 shadow-sm sm:p-6">
        <Typography variant="overline" color="primary" className="!mb-1 !leading-none">
          Settings
        </Typography>
        <Typography variant="h4" fontWeight={700} className="!mb-2 text-slate-950">
          Tenant settings
        </Typography>
        <Typography color="text.secondary" className="max-w-3xl !text-sm sm:!text-base">
          Configure organization details, tax rules, default discounts, customer-facing terms, and payment integrations from one clean workspace.
        </Typography>
      </Box>

      <Paper className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <Box className="border-b border-slate-200 px-3 pt-3 sm:px-5 sm:pt-5">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 44,
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: 999,
                backgroundColor: "#0f172a",
              },
              "& .MuiTab-root": {
                minHeight: 44,
                px: 1.5,
                py: 1,
                mr: 1,
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 600,
                color: "#64748b",
              },
              "& .Mui-selected": {
                color: "#0f172a !important",
                backgroundColor: "rgba(148, 163, 184, 0.12)",
              },
            }}
          >
          <Tab label="Organization" />
          <Tab label="GST" />
          <Tab label="Discount" />
          <Tab label="Terms" />
          <Tab label="Payments" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box className="px-3 pb-3 pt-4 sm:px-5 sm:pb-5">
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <TabPanel value={activeTab} index={0}>
              <SectionCard
                eyebrow="Identity"
                title="Organization profile"
                description="Keep the tenant’s business identity and contact details consistent across the dashboard."
              >
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Organization Name"
                      value={settings.orgInfo.name}
                      onChange={handleFieldChange("orgInfo", "name")}
                      {...sharedFieldProps}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Owner Name"
                      value={settings.orgInfo.ownerName}
                      onChange={handleFieldChange("orgInfo", "ownerName")}
                      {...sharedFieldProps}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Contact Email"
                      type="email"
                      value={settings.orgInfo.contactEmail}
                      onChange={handleFieldChange("orgInfo", "contactEmail")}
                      {...sharedFieldProps}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Contact Phone"
                      value={settings.orgInfo.contactPhone}
                      onChange={handleFieldChange("orgInfo", "contactPhone")}
                      {...sharedFieldProps}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Organization Address"
                      value={settings.orgInfo.address}
                      onChange={handleFieldChange("orgInfo", "address")}
                      {...sharedFieldProps}
                      multiline
                      minRows={4}
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <SectionCard
                eyebrow="Tax"
                title="GST configuration"
                description="Enable GST and define the registration number and default rate used in billing."
              >
                <Box className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <Box>
                    <Typography className="!font-semibold !text-slate-900">GST collection</Typography>
                    <Typography color="text.secondary" className="!text-sm">
                      Turn tax handling on or off for this tenant.
                    </Typography>
                  </Box>
                  <FormControlLabel
                    className="!m-0"
                    control={
                      <Switch
                        checked={settings.gst.enabled}
                        onChange={handleFieldChange("gst", "enabled")}
                      />
                    }
                    label={settings.gst.enabled ? "Enabled" : "Disabled"}
                    labelPlacement="start"
                  />
                </Box>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="GST Number"
                      value={settings.gst.number}
                      onChange={handleFieldChange("gst", "number")}
                      {...sharedFieldProps}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="GST Rate (%)"
                      value={settings.gst.rate}
                      onChange={handleFieldChange("gst", "rate")}
                      {...sharedFieldProps}
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <SectionCard
                eyebrow="Pricing"
                title="Discount policy"
                description="Control whether staff can apply broad discounts and define the default operating range."
              >
                <Box className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <Box>
                    <Typography className="!font-semibold !text-slate-900">Overall discount</Typography>
                    <Typography color="text.secondary" className="!text-sm">
                      Enable tenant-wide discount defaults for checkout.
                    </Typography>
                  </Box>
                  <FormControlLabel
                    className="!m-0"
                    control={
                      <Switch
                        checked={settings.discount.enabled}
                        onChange={handleFieldChange("discount", "enabled")}
                      />
                    }
                    label={settings.discount.enabled ? "Enabled" : "Disabled"}
                    labelPlacement="start"
                  />
                </Box>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Default discount (%)"
                      value={settings.discount.defaultPercent}
                      onChange={handleFieldChange("discount", "defaultPercent")}
                      {...sharedFieldProps}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Maximum discount (%)"
                      value={settings.discount.maxPercent}
                      onChange={handleFieldChange("discount", "maxPercent")}
                      {...sharedFieldProps}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Discount notes"
                      value={settings.discount.notes}
                      onChange={handleFieldChange("discount", "notes")}
                      {...sharedFieldProps}
                      multiline
                      minRows={3}
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <SectionCard
                eyebrow="Policy"
                title="Terms and conditions"
                description="Set the default terms shown to customers or staff during ordering and billing."
              >
                <TextField
                  label="Terms and conditions"
                  value={settings.terms.text}
                  onChange={handleFieldChange("terms", "text")}
                  {...sharedFieldProps}
                  multiline
                  minRows={10}
                />
              </SectionCard>
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <Box className="mb-4">
                <Typography variant="h6" className="!mb-1 !font-semibold !text-slate-950">
                  Payment integrations
                </Typography>
                <Typography color="text.secondary" className="!text-sm">
                  Enable the payment methods you support and keep each provider credential grouped in its own card.
                </Typography>
              </Box>
              <Grid container spacing={2.5}>
                <Grid item xs={12} md={6}>
                  <PaymentCard
                    title="Razorpay"
                    description="Primary card and gateway integration for online payments."
                    enabled={settings.payments.razorpay.enabled}
                    onToggle={handlePaymentFieldChange("razorpay", "enabled")}
                  >
                    <TextField
                      label="Key"
                      value={settings.payments.razorpay.key}
                      onChange={handlePaymentFieldChange("razorpay", "key")}
                      {...sharedFieldProps}
                    />
                    <TextField
                      label="Secret"
                      value={settings.payments.razorpay.secret}
                      onChange={handlePaymentFieldChange("razorpay", "secret")}
                      {...sharedFieldProps}
                    />
                    <TextField
                      label="Account ID"
                      value={settings.payments.razorpay.accountId}
                      onChange={handlePaymentFieldChange("razorpay", "accountId")}
                      {...sharedFieldProps}
                    />
                  </PaymentCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <PaymentCard
                    title="Google Pay"
                    description="Store merchant identity and UPI details for Google Pay flows."
                    enabled={settings.payments.googlepay.enabled}
                    onToggle={handlePaymentFieldChange("googlepay", "enabled")}
                  >
                    <TextField
                      label="Merchant ID"
                      value={settings.payments.googlepay.merchantId}
                      onChange={handlePaymentFieldChange("googlepay", "merchantId")}
                      {...sharedFieldProps}
                    />
                    <TextField
                      label="UPI ID"
                      value={settings.payments.googlepay.upiId}
                      onChange={handlePaymentFieldChange("googlepay", "upiId")}
                      {...sharedFieldProps}
                    />
                  </PaymentCard>
                </Grid>
                <Grid item xs={12} md={6}>
                  <PaymentCard
                    title="PhonePe"
                    description="Configure merchant and UPI details for PhonePe-based collections."
                    enabled={settings.payments.phonepay.enabled}
                    onToggle={handlePaymentFieldChange("phonepay", "enabled")}
                  >
                    <TextField
                      label="Merchant ID"
                      value={settings.payments.phonepay.merchantId}
                      onChange={handlePaymentFieldChange("phonepay", "merchantId")}
                      {...sharedFieldProps}
                    />
                    <TextField
                      label="UPI ID"
                      value={settings.payments.phonepay.upiId}
                      onChange={handlePaymentFieldChange("phonepay", "upiId")}
                      {...sharedFieldProps}
                    />
                  </PaymentCard>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        )}

        <Divider />
        <Box className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
          <Typography color="text.secondary" className="!text-sm">
            Review changes before saving. Reload will fetch the latest values from the server.
          </Typography>
          <Box className="flex items-center justify-end gap-2">
          <Button variant="outlined" size="small" disabled={loading || saving} onClick={fetchSettings}>
            Reload
          </Button>
          <Button variant="contained" size="small" onClick={handleSave} disabled={loading || saving}>
            {saving ? "Saving..." : "Save settings"}
          </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
