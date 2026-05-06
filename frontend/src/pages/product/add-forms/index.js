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
import { useParams, useLocation, useSearchParams, useNavigate } from "react-router-dom";

export default function AddProduct() {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const form = useSelector((state) => state.inventory.productForm);

  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

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
    // Basic validation
    if (!form.name || !form.category || !form.sku) {
      setError("Please fill in all required fields: Product Name, Category, and SKU");
      return;
    }

    setError(null); // Clear any previous errors

    try {
      const res = await saveProducts(form);
      const productId = res.data._id;
      
      await uploadImages(productId);
      setShowSuccess(true);
    }
    catch (err) {
      console.log("err onSave", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to save product. Please try again.";
      setError(errorMessage);
    }
  };
  // ========================================================

  // ================== UPDATE PRODUCT ==================
  const handleUpdate = async () => {
    // Basic validation
    if (!form.name || !form.category || !form.sku) {
      setError("Please fill in all required fields: Product Name, Category, and SKU");
      return;
    }

    setError(null); // Clear any previous errors

    try {
      await updateProduct(form._id, form);
      await uploadImages(form._id);
      await deleteImages(form._id);
      setShowSuccess(true);
    } catch (err) {
      console.log("err handleUpdate", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update product. Please try again.";
      setError(errorMessage);
    }
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

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };
  // =======================================================

  // ================== SUCCESS HANDLERS ==================
  const handleAddMore = () => {
    // Reset form
    dispatch(setProductForm({}));
    // Reset image states
    setExistingImages([]);
    setNewImages([]);
    setRemovedImages([]);
    setImageAttrs({});
    // Reset step and hide success
    setStep(1);
    setShowSuccess(false);
    setError(null); // Clear any errors
  };

  const handleViewAll = () => {
    navigate('/ViewProducts'); // Assuming the products list route
  };
  // =======================================================

  return (
    <div className="container card p-3">
      {showSuccess ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <span className="fs-1 text-success">✅</span>
          </div>
          <h3 className="mb-3">Product Added Successfully!</h3>
          <p className="text-muted mb-4">Your product has been saved to the inventory.</p>
          <div className="d-flex gap-3 justify-content-center">
            <button className="btn btn-primary" onClick={handleAddMore}>
              Add More Product
            </button>
            <button className="btn btn-outline-primary" onClick={handleViewAll}>
              View All Products
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2>Add / Update Product</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> {error}
            </div>
          )}

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
              <button className="btn btn-primary btn-sm" onClick={() => setStep(step - 1)}>Previous</button>
            )}

            {step < totalSteps ? (
              <>
              <div></div>
              <button className="btn btn-primary btn-sm" onClick={() => setStep(step + 1)}>Next</button>
              </>
            ) : id ? (
              <button className="btn btn-primary btn-sm" onClick={handleUpdate}>Update Product</button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={onSave}>Save Product</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
