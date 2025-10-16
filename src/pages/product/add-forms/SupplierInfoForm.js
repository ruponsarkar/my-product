import React from "react";
import Input from "../../../components/form/input";

export default function SupplierInfoForm({handleChange, form}) {
  return (
    <div className="row mb-4 p-3 border rounded">
      <h4>Supplier Information</h4>

      <div className="col-md-3 mt-3">
        <Input label="Supplier Name" name="supplierName" onChange={handleChange} value={form.supplierName} />
      </div>
      <div className="col-md-3 mt-3">
        <Input label="Supplier Contact" name="supplierContact" onChange={handleChange} value={form.supplierContact} />
      </div>
      <div className="col-md-3 mt-3">
        <Input label="Purchase Date" type="date" name="purchaseDate" onChange={handleChange} value={form.purchaseDate} />
      </div>
      <div className="col-md-3 mt-3">
        <Input label="Warranty" type="date" name="warranty" onChange={handleChange} value={form.warranty} />
      </div>
      <div className="col-md-3 mt-3">
        <Input label="Expiry Date" type="date" name="expiryDate" onChange={handleChange} value={form.expiryDate} />
      </div>
    </div>
  );
}
