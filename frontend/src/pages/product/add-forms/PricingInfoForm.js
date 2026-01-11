import React from "react";
import Input from "../../../components/form/input";

export default function PricingInfoForm({handleChange, form}) {
  return (
    <div className="row mb-4 p-3 border rounded">
      <h4>Pricing Information</h4>

      <div className="mt-3 col-md-3">
        <Input label="MRP" type="number" name="mrp" onChange={handleChange} value={form.mrp} />
      </div>

      <div className="mt-3 col-md-3">
        <Input label="Selling Price" type="number" name="sellingPrice" onChange={handleChange} value={form.sellingPrice} />
      </div>

      <div className="mt-3 col-md-3">
        <Input label="Cost Price" type="number" name="costPrice" onChange={handleChange} value={form.costPrice} />
      </div>
      
      {/* <div className="mt-3 col-md-3">
        <Input label="Discount (%)" type="number" name="discount" onChange={handleChange} value={form.discount} />
      </div>
      <div className="mt-3 col-md-3">
        <Input label="Tax (%)" type="number" name="tax" onChange={handleChange} value={form.tax} />
      </div> */}
     
    </div>
  );
}
