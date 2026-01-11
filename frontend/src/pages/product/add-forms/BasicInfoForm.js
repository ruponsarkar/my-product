import React, { useState, useEffect } from "react";
import Input from "../../../components/form/input";
import JoditEditorAuto from "../../../components/form/JoditEditorAuto";
import { GenerateSkuBarcode } from "../../../components/barcode/generate";
import Modal from "../../../components/modal/modal";
import CreatableSelect from "../../../components/form/CreatableSelect";
import { getCategories, getBrands } from "../../../api/services/product/productApi";

export default function BasicInfoForm({ handleChange, form, editorContent, setEditorContent }) {


  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    getCategory();
    // getBrands();
  }, []);

  useEffect(() => {
    if(form.category){
      getAllBrands(form.category);
    }
  }, [form.category]);

  const getAllBrands = async (cat) => {
    const res = await getBrands(cat);
    setBrands(res.data);
  };

  const getCategory = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const appendSku = ({ sku, barcode }) => {
    // console.log("sku", sku);
    handleChange({ sku, barcode }); // ONE dispatch
    handleClose();
  };

  // const categories = ["Electronics", "Clothing", "Furniture"];


  return (
    <div className="row mb-4 p-3 border rounded pb-5">
      <h4>Basic Information</h4>

      <div className="mt-3">
        <label htmlFor="">Product Name  </label>
        <Input label="Product Name" name="name" onChange={handleChange} value={form.name} />
      </div>
      <div className="mt-3 col-md-3">
        <label htmlFor="">Category</label>
        {/* <Input label="Category" name="category" onChange={handleChange} value={form.category} /> */}
        <CreatableSelect
          label="Category"
          options={categories}
          value={form.category}
          onChange={(val) =>
            handleChange({
              target: { name: "category", value: val },
            })
          }
        />
      </div>
      <div className="mt-3 col-md-3">
        <label htmlFor="">Brand</label>
        {/* <Input label="Brand" name="brand" onChange={handleChange} value={form.brand} /> */}
        <CreatableSelect
          label="Brand"
          options={brands}
          value={form.brand}
          onChange={(val) =>
            handleChange({
              target: { name: "brand", value: val },
            })
          }
        />
      </div>
      <div className="mt-3 col-md-3">
        <label htmlFor="">
          SKU  <span onClick={handleOpen} className="border border-primary text-primary cursor-pointer rounded px-2">Generate</span>
        </label>
        <Input label="SKU" name="sku" onChange={handleChange} value={form.sku} />
      </div>
      <div className="mt-3 col-md-3">
        <label htmlFor="">Barcode</label>
        <Input label="Barcode" name="barcode" onChange={handleChange} value={form.barcode} />
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


      <Modal
        open={open}
        handleClose={handleClose}
        content={<GenerateSkuBarcode
          category={form.category}
          brand={form.brand}
          onApply={appendSku}

        />}
        title="Generate SKU and Barcode" />

    </div>
  );
}
