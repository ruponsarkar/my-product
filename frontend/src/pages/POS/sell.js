import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByIdOrSlug } from "../../api/services/product/productApi";
import { createOrder } from "../../api/services/order/orderApi";

export default function Sell() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({
    weight: null,
    size: null,
    color: null,
  });
  const [qty, setQty] = useState(1);
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getData = async () => {
    if (!slug) return;
    const response = await getProductByIdOrSlug(slug);
    setProduct(response.data);
  };

  useEffect(() => {
    getData();
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    setSelectedAttrs({
      weight: product?.attributes?.weight?.[0] ?? null,
      size: product?.attributes?.size?.[0] ?? null,
      color: product?.attributes?.color?.[0] ?? null,
    });
  }, [product]);

  const unitPrice = useMemo(() => {
    const sellingPrice = Number(product?.sellingPrice || 0);
    const discountPercent = Number(product?.discount || 0);
    return sellingPrice * (100 - discountPercent) / 100;
  }, [product]);

  const subtotal = useMemo(() => unitPrice * qty, [qty, unitPrice]);
  const discountAmount = useMemo(() => {
    const mrp = Number(product?.mrp || product?.sellingPrice || 0);
    const basePrice = Number(product?.sellingPrice || mrp || 0);
    const discountedUnit = Math.max(basePrice - unitPrice, 0);
    return discountedUnit * qty;
  }, [product, qty, unitPrice]);
  const taxAmount = useMemo(() => {
    const taxPercent = Number(product?.tax || 0);
    return subtotal * taxPercent / 100;
  }, [product, subtotal]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);
  const normalizedPaidAmount = useMemo(() => {
    if (paymentType === "credit") {
      return Math.max(0, Number(paidAmount || 0));
    }
    return total;
  }, [paidAmount, paymentType, total]);
  const creditAmount = useMemo(
    () => Math.max(total - normalizedPaidAmount, 0),
    [normalizedPaidAmount, total]
  );

  const formatCurrency = (v) => {
    if (typeof Intl !== "undefined")
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(v);
    return `₹${v}`;
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  const handleAttrChange = (key, value) => {
    setSelectedAttrs((s) => ({ ...s, [key]: value }));
  };

  const getImgUrl = (url) => {
    if (!url) return "";
    const img = `${process.env.REACT_APP_BACKEND || ""}${url}`;
    return img;
  };

  const handlePlaceOrder = async () => {
    if (!product?._id) {
      setErrorMessage("Product details are not available yet.");
      return;
    }

    if (qty < 1) {
      setErrorMessage("Quantity must be at least 1.");
      return;
    }

    if (qty > Number(product?.stockQty || 0)) {
      setErrorMessage("Requested quantity is more than available stock.");
      return;
    }

    if (!paymentType) {
      setErrorMessage("Please select a payment type.");
      return;
    }

    if (paymentType === "credit" && normalizedPaidAmount > total) {
      setErrorMessage("Paid amount cannot be greater than total for a credit order.");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        items: [
          {
            product: product._id,
            quantity: qty,
            price: Number(unitPrice.toFixed(2)),
          },
        ],
        subtotal: Number(subtotal.toFixed(2)),
        discount: Number(discountAmount.toFixed(2)),
        tax: Number(taxAmount.toFixed(2)),
        total: Number(total.toFixed(2)),
        paidAmount: Number(normalizedPaidAmount.toFixed(2)),
        credit: Number(creditAmount.toFixed(2)),
        payment_type: paymentType,
        customer_phone: customerPhone.trim() || undefined,
      };

      const response = await createOrder(payload);
      const orderId = response?.data?.order?.order_id;

      setSuccessMessage(orderId ? `Order ${orderId} placed successfully.` : "Order placed successfully.");
      setProduct((currentProduct) =>
        currentProduct
          ? {
              ...currentProduct,
              stockQty: Math.max(Number(currentProduct.stockQty || 0) - qty, 0),
            }
          : currentProduct
      );
      setQty(1);
      setCustomerPhone("");
      setPaidAmount("");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to place the order right now."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isOutOfStock = Number(product?.stockQty || 0) <= 0;
  const canSubmit = product?._id && !isOutOfStock && !submitting;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* LEFT: Images */}
          <div className="lg:col-span-1">
            <div className="rounded-md overflow-hidden border">
              <img
                src={
                    getImgUrl(product?.images?.[mainImageIndex]?.url)
                }
                // src={
                //   product?.images?.[mainImageIndex]?.url ??
                //   product?.images?.[mainImageIndex]?.path
                // }
                alt={product?.name}
                className="w-full h-72 object-contain bg-gray-50"
              />
            </div>

            <div className="mt-3 flex gap-2">
              {(product?.images || []).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  className={`w-20 h-20 rounded border overflow-hidden flex items-center justify-center ${
                    idx === mainImageIndex ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <img
                    src={getImgUrl(img?.url)}
                    
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div>
                <strong>SKU:</strong> {product?.sku}
              </div>
              <div>
                <strong>Stock:</strong> {product?.stockQty}{" "}
                {product?.stockQty > 0 ? (
                  <span className="text-green-600">(In stock)</span>
                ) : (
                  <span className="text-red-600">(Out of stock)</span>
                )}
              </div>
              <div>
                <strong>Reorder Level:</strong> {product?.reorderLevel}
              </div>
            </div>
          </div>

          {/* CENTER: Basic info & attributes */}
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h2 className="text-2xl font-semibold">{product?.name}</h2>
                <div className="text-sm text-gray-500 mt-1">
                  {product?.brand} • {product?.category}
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="text-3xl font-bold">
                    {formatCurrency(unitPrice)}
                  </div>
                  {product?.discount ? (
                    <div className="text-sm text-gray-500 line-through">
                      {formatCurrency(product?.mrp)}
                    </div>
                  ) : null}
                  {product?.isFeatured && (
                    <span className="ml-2 inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {!product?.isActive && (
                    <span className="ml-2 inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  Ratings: {product?.ratingsAverage} ({product?.ratingsCount}{" "}
                  reviews)
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Attribute pickers */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Weight
                    </label>
                    <select
                      value={selectedAttrs.weight}
                      onChange={(e) =>
                        handleAttrChange("weight", e.target.value)
                      }
                      className="mt-1 block w-full rounded border px-2 py-1"
                    >
                      {(product?.attributes?.weight || []).map((w, i) => (
                        <option key={i} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Size
                    </label>
                    <select
                      value={selectedAttrs.size}
                      onChange={(e) => handleAttrChange("size", e.target.value)}
                      className="mt-1 block w-full rounded border px-2 py-1"
                    >
                      {(product?.attributes?.size || []).map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Color
                    </label>
                    <div className="mt-1 flex gap-2">
                      {(product?.attributes?.color || []).map((c, i) => (
                        <button
                          key={i}
                          onClick={() => handleAttrChange("color", c)}
                          className={`w-8 h-8 rounded-full border flex-shrink-0 ${
                            selectedAttrs.color === c
                              ? "ring-2 ring-indigo-500"
                              : ""
                          }`}
                          title={c}
                          style={{ backgroundColor: c }}
                        >
                          {/* simple color indicator, for names show initials */}
                          <span className="sr-only">{c}</span>
                          <div className="w-full h-full flex items-center justify-center text-xs" >
                            {c.charAt(0).toUpperCase()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-3"
                    >
                      -
                    </button>
                    <div className="px-4">{qty}</div>
                    <button
                      onClick={() =>
                        setQty((q) => Math.min(Number(product?.stockQty || 0), q + 1))
                      }
                      className="px-3"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Line total: <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">Create order</h3>
                        <p className="text-sm text-slate-500">
                          Place the order directly from this screen using the new order API.
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isOutOfStock ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {isOutOfStock ? "Out of stock" : "Ready to order"}
                      </span>
                    </div>

                    {successMessage ? (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        {successMessage}
                      </div>
                    ) : null}

                    {errorMessage ? (
                      <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                        {errorMessage}
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Customer phone
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Optional phone number"
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Payment type
                        </label>
                        <select
                          value={paymentType}
                          onChange={(e) => setPaymentType(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        >
                          <option value="cash">Cash</option>
                          <option value="online">Online</option>
                          <option value="credit">Credit</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Paid amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={paymentType === "credit" ? paidAmount : total.toFixed(2)}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          disabled={paymentType !== "credit"}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-500"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          {paymentType === "credit"
                            ? "Enter the amount received now. Remaining balance will be saved as credit."
                            : "For cash and online payments, the full amount is collected automatically."}
                        </p>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Subtotal</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                          <span>Discount</span>
                          <span>- {formatCurrency(discountAmount)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                          <span>Tax</span>
                          <span>+ {formatCurrency(taxAmount)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                          <span>Credit</span>
                          <span>{formatCurrency(creditAmount)}</span>
                        </div>
                        <div className="mt-3 border-t border-slate-200 pt-3 flex items-center justify-between font-semibold text-slate-900">
                          <span>Total</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={!canSubmit}
                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {submitting ? "Placing order..." : "Place order"}
                      </button>
                      <div className="text-sm text-slate-500 self-center">
                        Orders submit to the authenticated `POST /orders` endpoint and reduce stock after success.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 grid grid-cols-2 gap-2">
                  <div>
                    <strong>Supplier:</strong> {product?.supplierName} •{" "}
                    {product?.supplierContact}
                  </div>
                  <div>
                    <strong>Warehouse:</strong> {product?.warehouse}
                  </div>
                  <div>
                    <strong>Purchase Date:</strong>{" "}
                    {formatDate(product?.purchaseDate)}
                  </div>
                  <div>
                    <strong>Expiry Date:</strong>{" "}
                    {formatDate(product?.expiryDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Details */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium">Product Description</h3>
              <div
                className="prose prose-sm mt-2"
                dangerouslySetInnerHTML={{ __html: product?.description }}
              />

              <h4 className="mt-4 font-semibold">Specifications</h4>
              <div className="overflow-auto mt-2">
                <table className="w-full text-sm table-auto">
                  <tbody>
                    <tr className="border-t">
                      <th className="text-left py-2 w-1/3">Cost Price</th>
                      <td className="py-2">
                        {formatCurrency(product?.costPrice)}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <th className="text-left py-2">Selling Price</th>
                      <td className="py-2">
                        {formatCurrency(product?.sellingPrice)}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <th className="text-left py-2">MRP</th>
                      <td className="py-2">{formatCurrency(product?.mrp)}</td>
                    </tr>
                    <tr className="border-t">
                      <th className="text-left py-2">Discount</th>
                      <td className="py-2">{product?.discount || 0}%</td>
                    </tr>
                    <tr className="border-t">
                      <th className="text-left py-2">Tax</th>
                      <td className="py-2">{product?.tax || 0}%</td>
                    </tr>
                    <tr className="border-t">
                      <th className="text-left py-2">Warranty</th>
                      <td className="py-2">{formatDate(product?.warranty)}</td>
                    </tr>
                    <tr className="border-t">
                      <th className="text-left py-2">Created At</th>
                      <td className="py-2">{formatDate(product?.createdAt)}</td>
                    </tr>
                    <tr className="border-t">
                      <th className="text-left py-2">Updated At</th>
                      <td className="py-2">{formatDate(product?.updatedAt)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
