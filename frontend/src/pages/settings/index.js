import React, { useEffect, useState } from "react";
import {
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
  Alert,
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

  return (
    <Box className="w-full px-4 py-6">
      <Box className="mb-6">
        <Typography variant="overline" color="primary" gutterBottom>
          Settings
        </Typography>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Tenant settings
        </Typography>
        <Typography color="text.secondary">
          Configure organization details, tax settings, discounts, terms, and payment integrations for this tenant.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Organization" />
          <Tab label="GST" />
          <Tab label="Discount" />
          <Tab label="Terms" />
          <Tab label="Payments" />
        </Tabs>

        {loading ? (
          <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Organization Name"
                    value={settings.orgInfo.name}
                    onChange={handleFieldChange("orgInfo", "name")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Owner Name"
                    value={settings.orgInfo.ownerName}
                    onChange={handleFieldChange("orgInfo", "ownerName")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Contact Email"
                    type="email"
                    value={settings.orgInfo.contactEmail}
                    onChange={handleFieldChange("orgInfo", "contactEmail")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Contact Phone"
                    value={settings.orgInfo.contactPhone}
                    onChange={handleFieldChange("orgInfo", "contactPhone")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Organization Address"
                    value={settings.orgInfo.address}
                    onChange={handleFieldChange("orgInfo", "address")}
                    fullWidth
                    multiline
                    minRows={4}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.gst.enabled}
                      onChange={handlePaymentFieldChange("gst", "enabled")}
                    />
                  }
                  label="Enable GST"
                />
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="GST Number"
                    value={settings.gst.number}
                    onChange={handleFieldChange("gst", "number")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="GST Rate (%)"
                    value={settings.gst.rate}
                    onChange={handleFieldChange("gst", "rate")}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.discount.enabled}
                      onChange={handlePaymentFieldChange("discount", "enabled")}
                    />
                  }
                  label="Enable overall discount"
                />
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Default discount (%)"
                    value={settings.discount.defaultPercent}
                    onChange={handleFieldChange("discount", "defaultPercent")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Maximum discount (%)"
                    value={settings.discount.maxPercent}
                    onChange={handleFieldChange("discount", "maxPercent")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Discount notes"
                    value={settings.discount.notes}
                    onChange={handleFieldChange("discount", "notes")}
                    fullWidth
                    multiline
                    minRows={3}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <TextField
                label="Terms and conditions"
                value={settings.terms.text}
                onChange={handleFieldChange("terms", "text")}
                fullWidth
                multiline
                minRows={10}
              />
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Razorpay
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.payments.razorpay.enabled}
                          onChange={handlePaymentFieldChange("razorpay", "enabled")}
                        />
                      }
                      label="Enabled"
                    />
                    <TextField
                      label="Key"
                      value={settings.payments.razorpay.key}
                      onChange={handlePaymentFieldChange("razorpay", "key")}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="Secret"
                      value={settings.payments.razorpay.secret}
                      onChange={handlePaymentFieldChange("razorpay", "secret")}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="Account ID"
                      value={settings.payments.razorpay.accountId}
                      onChange={handlePaymentFieldChange("razorpay", "accountId")}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Google Pay
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.payments.googlepay.enabled}
                          onChange={handlePaymentFieldChange("googlepay", "enabled")}
                        />
                      }
                      label="Enabled"
                    />
                    <TextField
                      label="Merchant ID"
                      value={settings.payments.googlepay.merchantId}
                      onChange={handlePaymentFieldChange("googlepay", "merchantId")}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="UPI ID"
                      value={settings.payments.googlepay.upiId}
                      onChange={handlePaymentFieldChange("googlepay", "upiId")}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      PhonePe
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.payments.phonepay.enabled}
                          onChange={handlePaymentFieldChange("phonepay", "enabled")}
                        />
                      }
                      label="Enabled"
                    />
                    <TextField
                      label="Merchant ID"
                      value={settings.payments.phonepay.merchantId}
                      onChange={handlePaymentFieldChange("phonepay", "merchantId")}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="UPI ID"
                      value={settings.payments.phonepay.upiId}
                      onChange={handlePaymentFieldChange("phonepay", "upiId")}
                      fullWidth
                      sx={{ mt: 2 }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" disabled={loading || saving} onClick={fetchSettings}>
            Reload
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={loading || saving}>
            {saving ? "Saving..." : "Save settings"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
