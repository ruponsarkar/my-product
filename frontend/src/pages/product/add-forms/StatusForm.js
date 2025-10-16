import React from "react";

export default function StatusForm({handleChange, form, onSave}) {
  return (
    <div className="mb-4 p-3 border rounded">
      <h4>Status</h4>

      <div className="mt-3">
        <label>
          <input type="checkbox" name="isActive" onChange={handleChange} checked={form.isActive} value={form.isActive}/> Active
        </label>
      </div>

      <div className="mt-3">
        <label>
          <input type="checkbox" name="isFeatured" onChange={handleChange} checked={form.isFeatured} value={form.isFeatured}/> Featured
        </label>
      </div>

      <div className="mt-3">
        <label>Tags</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. electronics, mobile"
        />
      </div>

    </div>
  );
}
