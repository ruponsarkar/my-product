import React from "react";
import BarcodePreview from ".";
import { getLastSkuNumber } from "../../api/services/product/productApi";

import "./printCSS.css";

export function GenerateSkuBarcode({ category, brand, lastId, onApply }) {
    const [sku, setSku] = React.useState("");
    const [quantity, setQuantity] = React.useState(1);

    // example: CAT-BRAND-000123
    // function generateSKU({ category, brand, lastId }) {
    //     const cat = category?.substring(0, 3).toUpperCase();
    //     const br = brand?.substring(0, 3).toUpperCase();
    //     console.log("getLastSkuNumberApi(`${cat}-${br}-`) ", getLastSkuNumberApi(`${cat}-${br}-`));
    //     const seq = String(getLastSkuNumberApi(`${cat}-${br}-`) + 1).padStart(6, "0");
    //     // const seq = getLastSkuNumber(`${cat}-${br}-`);


    //     return `${cat}-${br}-${seq}`;
    // }

    // Make generateSKU async
    async function generateSKU({ category, brand }) {
        const cat = category?.substring(0, 3).toUpperCase();
        const br = brand?.substring(0, 3).toUpperCase();

        // Fetch the last number from backend
        const lastNumber = await getLastSkuNumberApi(`${cat}-${br}-`);
        console.log("lastNumber ", lastNumber);
        // Increment and pad
        const seq = String(lastNumber + 1).padStart(6, "0");
        // console.log("${cat}-${br}-${seq} ", `${cat}-${br}-${seq}`);
        return `${cat}-${br}-${seq}`;
    }

    const getLastSkuNumberApi = async (prefix) => {
        const res = await getLastSkuNumber(prefix);
        return res.data.lastNumber;
    }

    const handleGenerate = async () => {
        if (!category || !brand) {
            alert("Please select category and brand");
            return;
        }

        const generatedSku = await generateSKU({
            category: category,
            brand: brand,
            lastId: 123,
        });

        setSku(generatedSku);
    };

    const handlePrint = () => {
        window.print(); // thermal printer will use print CSS
    };

    const handleApply = () => {
        onApply({
            sku,
            barcode: sku, // usually barcode = SKU
        });
    };

    return (
        <div>
            {!sku && (
                <button className="btn btn-primary" onClick={handleGenerate}>
                    Click here to Generate SKU
                </button>
            )}


            {/* {sku && (
                <>
                    <BarcodePreview value={sku} />

                    <div className="form-group">
                        <label>Print Quantity</label>
                        <input
                            className="form-control"
                            type="number"
                            value={quantity}
                            min={1}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="mt-3 d-flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={handlePrint}>Print</button>
                        <button className="btn btn-primary btn-sm" onClick={handleApply}>Use This SKU</button>
                    </div>
                </>
            )} */}

            {sku && (
                <>
                    {/* SCREEN PREVIEW (optional – show one) */}
                    {/* <BarcodePreview value={sku} /> */}

                    <div className="form-group">
                        <label>Print Quantity</label>
                        <input
                            className="form-control"
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    <div className="mt-3 d-flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                            Print
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={handleApply}>
                            Use This SKU
                        </button>
                    </div>

                    {/* PRINT ONLY AREA */}
                    <div className="barcode-print-area">
                        {Array.from({ length: quantity }).map((_, i) => (
                            <div key={i} className="barcode-label">
                                <BarcodePreview value={sku} />
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}
