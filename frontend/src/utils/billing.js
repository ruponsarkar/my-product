export const formatBillingCurrency = (value, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatBillingDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[data-razorpay="checkout"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpay = "checkout";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const buildInvoiceHtml = ({ invoice, tenant, transaction }) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
        .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
        .brand { font-size: 28px; font-weight: 700; }
        .muted { color:#64748b; font-size:14px; }
        .card { border:1px solid #e2e8f0; border-radius:16px; padding:20px; margin-bottom:20px; }
        table { width:100%; border-collapse: collapse; margin-top:12px; }
        th, td { text-align:left; padding:12px 8px; border-bottom:1px solid #e2e8f0; }
        th { color:#475569; font-size:12px; text-transform:uppercase; letter-spacing:0.08em; }
        .amount { font-size:24px; font-weight:700; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">Inventory Billing</div>
          <div class="muted">Subscription invoice</div>
        </div>
        <div>
          <div><strong>Invoice:</strong> ${invoice.invoiceNumber}</div>
          <div class="muted">Issued ${formatBillingDate(invoice.issuedAt)}</div>
        </div>
      </div>

      <div class="card">
        <div><strong>Billed to:</strong> ${tenant.name}</div>
        <div class="muted">${tenant.email || "No email available"}</div>
        <div class="muted">Tenant ID: ${tenant.tenantId}</div>
      </div>

      <div class="card">
        <div class="amount">${formatBillingCurrency(invoice.amount, invoice.currency)}</div>
        <div class="muted">${invoice.planName} • ${invoice.billingCycle}</div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Period Start</th>
              <th>Period End</th>
              <th>Payment ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoice.planName}</td>
              <td>${formatBillingDate(invoice.periodStart)}</td>
              <td>${formatBillingDate(invoice.periodEnd)}</td>
              <td>${invoice.paymentId || transaction.gatewayPaymentId || "--"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>
`;

export const downloadInvoiceFile = (payload) => {
  const html = buildInvoiceHtml(payload);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${payload.invoice.invoiceNumber}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
