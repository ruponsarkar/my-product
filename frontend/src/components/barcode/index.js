import JsBarcode from "jsbarcode";
import { useEffect, useRef } from "react";

export default function BarcodePreview({ value }) {
  const svgRef = useRef();

  useEffect(() => {
    if (value) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
      });
    }
  }, [value]);

  return <svg ref={svgRef}></svg>;
}
