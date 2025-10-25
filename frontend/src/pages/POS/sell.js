import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByIdOrSlug } from "../../api/services/product/productApi";

export default function Sell({  }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedAttrs, setSelectedAttrs] = useState({
    weight: product?.attributes?.weight?.[0] ?? null,
    size: product?.attributes?.size?.[0] ?? null,
    color: product?.attributes?.color?.[0] ?? null,
  });
  const [qty, setQty] = useState(1);


  useEffect(()=>{
    getData();

  },[]);

const getData=async ()=>{
    if(slug){
        const response = await getProductByIdOrSlug(slug);
        console.log("response", response.data);
        setProduct(response.data);
    }
      
}

  const priceAfterDiscount =
    (product?.sellingPrice * (100 - (product?.discount || 0))) / 100;

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
    let img = process.env.REACT_APP_BACKEND+url
    console.log("img", img);

    return img;
  };

  const handleBuyNow = () => {
    navigate("/order/new", {
      state: {
        product,
        qty,
        attributes: selectedAttrs,
      },
    });
  };

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
                    {formatCurrency(priceAfterDiscount)}
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
                        setQty((q) => Math.min(product?.stockQty, q + 1))
                      }
                      className="px-3"
                    >
                      +
                    </button>
                  </div>

                  <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Add to cart
                  </button>
                  <button className="border px-4 py-2 rounded" onClick={handleBuyNow}>Buy Now</button>
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
