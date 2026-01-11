import React from "react";
import Input from "../../../components/form/input";

export default function StockInfoForm({handleChange, form}) {


  return (
    <div className="row mb-4 p-3 border rounded">
      <h4>Stock Information</h4>

      <div className="mt-3 col-md-3">
        <label htmlFor="">Stock Quantity</label>
        <Input label="Quantity in Stock" type="number" name="stockQty" onChange={handleChange} value={form.stockQty}/>
      </div>
      <div className="mt-3 col-md-3">
        <label htmlFor="">  Warning if stock quantity is less than this </label>
        <Input label="Reorder Level" type="number" name="reorderLevel" onChange={handleChange} value={form.reorderLevel}/>
      </div>
      <div className="mt-3 col-md-3">
        <label htmlFor="">Maximum quantity to reorder</label>
        <Input label="Reorder Quantity" type="number" name="reorderQty" onChange={handleChange} value={form.reorderQty}/>
      </div>
      <div className="mt-3 col-md-3">
        <label htmlFor="">Where stock is located</label>
        <Input label="Warehouse Location" name="warehouse" onChange={handleChange} value={form.warehouse}/>
      </div>

      {/* <div>
        {JSON.stringify(form)}
      </div> */}
    </div>
  );
}
