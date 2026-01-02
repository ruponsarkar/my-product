import React, { useState, useEffect } from "react";
import BasicInfoForm from "./BasicInfoForm";
import StockInfoForm from "./StockInfoForm";
import PricingInfoForm from "./PricingInfoForm";
import SupplierInfoForm from "./SupplierInfoForm";
import AttributesForm from "./AttributesForm";
import MediaForm from "./MediaForm";
import StatusForm from "./StatusForm";
import { useSelector, useDispatch } from "react-redux";
import { setProductForm } from "../../../features/inventory/productSlice";
import {
  saveProducts,
  updateProduct,
} from "../../../api/services/product/productApi";
import { useSearchParams, useParams, useLocation } from "react-router-dom";
import {
  uploadProductImage,
  getProductByIdOrSlug,
} from "../../../api/services/product/productApi";

export default function AddProduct() {
  const { id } = useParams();
  const location = useLocation();

  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [editorContent, setEditorContent] = useState("");
  const form = useSelector((state) => state.inventory.productForm);
  const [productId, setProductId] = useState(null);

  const [images, setImages] = useState([]);
  const [imageAttrs, setImageAttrs] = useState({}); // <-- map: filename -> { attrName: [values] }

  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const totalSteps = 6;

  useEffect(() => {
    if (code) {
      dispatch(
        setProductForm({
          ...form,
          barcode: code,
        })
      );
    }
  }, [code]);

  // ================ for update =================
  useEffect(() => {
    // Check if path has updateProduct
    if (location.pathname.includes("updateProduct")) {
      console.log("Product ID:", id);
      getProduct();
    }
  }, []);

  const getProduct = async () => {
    try {
      const data = await getProductByIdOrSlug(id);
      console.log("data", data.data.images);
      dispatch(setProductForm(data.data));
      setImages(data.data.images);
    } catch (err) {
      console.log("error saving", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = await updateProduct(form._id, form);
      console.log("data", data.data);
      setProductId(data.data._id);
      // updateImage(data.data._id);
    } catch (err) {
      console.log("error saving", err);
    }
  };

  // ================ end for update =================

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const onSave = async () => {
    console.log("Saving product...");
    console.log("form:", form);
    // Later: gather all form data into one object
    // return;

    try {
      const data = await saveProducts(form);
      console.log("data", data.data);
      setProductId(data.data._id);
      updateImage(data.data._id);
    } catch (err) {
      console.log("error saving", err);
    }
  };

  const handleChange = (e) => {
    // BULK UPDATE (important)
    if (!e?.target) {
      dispatch(
        setProductForm({
          ...form,
          ...e, // merge multiple fields
        })
      );
      return;
    }
    const { name, type, checked, value } = e.target;

    dispatch(
      setProductForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      })
    );
  };

  const updateImage = async (productId) => {
    const formData = new FormData();
    images.forEach((img) => formData.append("images", img.file));
    formData.append("attributes", JSON.stringify(imageAttrs));

    const res = await uploadProductImage(productId, formData);
    console.log("upload image response: ", res);
    alert("Product saved successfully");
  };

  return (
    <div className="container mt-0">
      <h2 className="mb-3 pt-2">Add New Product</h2>

      {/* Stepper Header */}
      <div className="d-flex justify-content-between mb-4">
        {[
          "Basic",
          "Pricing",
          "Stock",
          "Supplier",
          "Attributes",
          "Media",
          // "Status",
        ].map((label, index) => (
          <div
            key={index}
            className={`text-center flex-fill ${
              step === index + 1 ? "fw-bold text-primary" : "text-muted"
            }`}
          >
            <div
              className={`rounded-circle border ${
                step === index + 1 ? "bg-primary text-white" : "bg-light"
              }`}
              style={{
                width: "40px",
                height: "40px",
                lineHeight: "40px",
                margin: "0 auto",
              }}
            >
              {index + 1}
            </div>
            <small>{label}</small>
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <>
          <BasicInfoForm
            handleChange={handleChange}
            form={form}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
          />
        </>
      )}
      {step === 2 && (
        <PricingInfoForm handleChange={handleChange} form={form} />
      )}
      {step === 3 && <StockInfoForm handleChange={handleChange} form={form} />}

      {step === 4 && (
        <SupplierInfoForm handleChange={handleChange} form={form} />
      )}
      {step === 5 && (
        <AttributesForm
          handleChange={handleChange}
          form={form}
          onSave={onSave}
        />
      )}
      {step === 6 && (
        <MediaForm
          handleChange={handleChange}
          form={form}
          productId={productId}
          images={images}
          setImages={setImages}
          imageAttrs={imageAttrs}
          setImageAttrs={setImageAttrs}
          // const [images, setImages] = useState([]);
          // const [imageAttrs, setImageAttrs] = useState({});
        />
      )}

      {/* {step === 7 && <StatusForm handleChange={handleChange} form={form} onSave={onSave}/>} */}

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between my-3 py-3">
        {step > 1 ? (
          <button className="btn btn-secondary" onClick={prevStep}>
            Previous
          </button>
        ) : (
          <div></div>
        )}

        {step < totalSteps ? (
          <button className="btn btn-primary" onClick={nextStep}>
            Next
          </button>
        ) : (
          <>
            {id ? (
              <button className="btn btn-success" onClick={handleUpdate}>
                Update Product
              </button>
            ) : (
              <button className="btn btn-success" onClick={onSave}>
                Save Product
              </button>
            )}

            {/* <button className="btn btn-success" onClick={onSave}>
              Save Product //{" "}
            </button> */}
          </>
        )}

        {/* <button className="btn btn-success" onClick={onSave}>
          Save Product
        </button> */}
      </div>
    </div>
  );
}
