import React from "react";
import Input from "../../../components/form/input";
import JoditEditorAuto from "../../../components/form/JoditEditorAuto";

export default function BasicInfoForm({handleChange, form, editorContent, setEditorContent }) {


  return (
    <div className="row mb-4 p-3 border rounded">
      <h4>Basic Information</h4>

      <div className="mt-3">
        <Input label="Product Name" name="name" onChange={handleChange} value={form.name}/>
      </div>
      <div className="mt-3 col-md-4">
        <Input label="SKU / Barcode" name="sku" onChange={handleChange} value={form.sku}/>
      </div>
      <div className="mt-3 col-md-4">
        <Input label="Category" name="category" onChange={handleChange} value={form.category}/>
      </div>
      <div className="mt-3 col-md-4">
        <Input label="Brand" name="brand" onChange={handleChange} value={form.brand}/>
      </div>

      <div className="mt-3">
        <label>Description</label>
        <JoditEditorAuto
        name={"description"}
        value={form.description}
        onChange={(newContent) => handleChange({ target: { name: "description", value: newContent } })}
        // value={editorContent}
          // onChange={(newContent) => setEditorContent(newContent)}
        />
      </div>

      {/* <div>
        {JSON.stringify(form)}
      </div> */}
    </div>
  );
}
