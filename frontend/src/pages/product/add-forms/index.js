import React, { useState, useEffect } from "react";
import BasicInfoForm from "./BasicInfoForm";
import StockInfoForm from "./StockInfoForm";
import PricingInfoForm from "./PricingInfoForm";
import SupplierInfoForm from "./SupplierInfoForm";
import AttributesForm from "./AttributesForm";
import MediaForm from "./MediaForm";
import { useSelector, useDispatch } from "react-redux";
import { setProductForm } from "../../../features/inventory/productSlice";
import {
  saveProducts,
  updateProduct,
  getProductByIdOrSlug,
  uploadProductImage,
  deleteProductImages,
} from "../../../api/services/product/productApi";
import { useParams, useLocation, useSearchParams } from "react-router-dom";

export default function AddProduct() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const form = useSelector((state) => state.inventory.productForm);

  const [step, setStep] = useState(1);

  console.log("id===>> ", code);

  useEffect(() => {
    if (code) {
      dispatch(setProductForm({ ...form, sku:code, barcode:code }));
    }
  }, [code]);

  // ================== IMAGE STATES (NEW) ==================
  const [existingImages, setExistingImages] = useState([]); // images from DB
  const [newImages, setNewImages] = useState([]); // newly uploaded files
  const [removedImages, setRemovedImages] = useState([]); // images marked for delete
  const [imageAttrs, setImageAttrs] = useState({}); // attributes map
  // ========================================================

  const totalSteps = 6;

  // ================== LOAD PRODUCT (UPDATE MODE) ==================
  useEffect(() => {
    if (location.pathname.includes("updateProduct") && id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    const res = await getProductByIdOrSlug(id);

    dispatch(setProductForm(res.data));

    setExistingImages(res.data.images || []); // ✅ existing images only
    setNewImages([]); // ✅ reset new uploads
    setRemovedImages([]); // ✅ reset deleted list
  };
  // ================================================================

  // ================== SAVE (ADD PRODUCT) ==================
  const onSave = async () => {

    try {
      
      const res = await saveProducts(form);
      const productId = res.data._id;
      
      await uploadImages(productId);
      alert("Product added successfully");
    }
    catch (err) {
      console.log("err onSave", err);
    }
  };
  // ========================================================

  // ================== UPDATE PRODUCT ==================
  const handleUpdate = async () => {
    await updateProduct(form._id, form);

    await uploadImages(form._id);
    await deleteImages(form._id);

    alert("Product updated successfully");
  };
  // =====================================================

  // ================== IMAGE HELPERS ==================
  const uploadImages = async (productId) => {
    if (newImages.length === 0) return;

    const formData = new FormData();
    newImages.forEach((img) => formData.append("images", img.file));
    formData.append("attributes", JSON.stringify(imageAttrs));
    // console.log("formData", formData);
    try{
      const res = await uploadProductImage(productId, formData);
      console.log("res", res);
    }
    catch(err){
      console.log("err uploadProductImage", err);
    }
  };

  const deleteImages = async (productId) => {
    if (removedImages.length === 0) return;
    console.log("removedImages", removedImages);
    await deleteProductImages(productId, { images: removedImages });
  };
  // ===================================================

  // ================== HANDLE FORM CHANGE ==================
  const handleChange = (e) => {
    if (!e?.target) {
      dispatch(setProductForm({ ...form, ...e }));
      return;
    }

    const { name, value, type, checked } = e.target;

    dispatch(
      setProductForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      })
    );
  };
  // =======================================================

  return (
    <div className="container">
      <h2>Add / Update Product</h2>

      {step === 1 && <BasicInfoForm handleChange={handleChange} form={form} />}
      {step === 2 && (
        <PricingInfoForm handleChange={handleChange} form={form} />
      )}
      {step === 3 && <StockInfoForm handleChange={handleChange} form={form} />}
      {step === 4 && (
        <SupplierInfoForm handleChange={handleChange} form={form} />
      )}
      {step === 5 && <AttributesForm handleChange={handleChange} form={form} />}

      {step === 6 && (
        <MediaForm
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          newImages={newImages}
          setNewImages={setNewImages}
          removedImages={removedImages}
          setRemovedImages={setRemovedImages}
          imageAttrs={imageAttrs}
          setImageAttrs={setImageAttrs}
        />
      )}

      <div className="d-flex justify-content-between mt-3">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}>Previous</button>
        )}

        {step < totalSteps ? (
          <button onClick={() => setStep(step + 1)}>Next</button>
        ) : id ? (
          <button onClick={handleUpdate}>Update Product</button>
        ) : (
          <button onClick={onSave}>Save Product</button>
        )}
      </div>
    </div>
  );
}
