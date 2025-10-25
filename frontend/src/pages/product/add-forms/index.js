import React, { useState } from "react";
import BasicInfoForm from "./BasicInfoForm";
import StockInfoForm from "./StockInfoForm";
import PricingInfoForm from "./PricingInfoForm";
import SupplierInfoForm from "./SupplierInfoForm";
import AttributesForm from "./AttributesForm";
import MediaForm from "./MediaForm";
import StatusForm from "./StatusForm";
import { useSelector, useDispatch } from "react-redux";
import { setProductForm } from "../../../features/inventory/productSlice";
import { saveProducts } from "../../../api/services/product/productApi";

export default function AddProduct() {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [editorContent, setEditorContent] = useState("");
  const form = useSelector((state) => state.inventory.productForm);
  const [productId, setProductId] = useState(null);

  const totalSteps = 6;

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
    } catch (err) {
      console.log("error saving", err);
    }  
  };


  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    dispatch(
      setProductForm({
        ...form,
        [name]: type === "checkbox" ? checked : value,
      })
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Add New Product</h2>

      {/* Stepper Header */}
      <div className="d-flex justify-content-between mb-4">
        {[
          "Basic",
          "Stock",
          "Pricing",
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
        <BasicInfoForm
          handleChange={handleChange}
          form={form}
          editorContent={editorContent}
          setEditorContent={setEditorContent}
        />
      )}
      {step === 2 && <StockInfoForm handleChange={handleChange} form={form} />}
      {step === 3 && (
        <PricingInfoForm handleChange={handleChange} form={form} />
      )}
      {step === 4 && (
        <SupplierInfoForm handleChange={handleChange} form={form} />
      )}
      {step === 5 && <AttributesForm handleChange={handleChange} form={form} onSave={onSave} />}
      {step === 6 && <MediaForm handleChange={handleChange} form={form} productId={productId}/>}
      {/* {step === 7 && <StatusForm handleChange={handleChange} form={form} onSave={onSave}/>} */}

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-3">
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
          <button className="btn btn-success" onClick={onSave}>
            Save Product
          </button>
        )}

        {/* <button className="btn btn-success" onClick={onSave}>
          Save Product
        </button> */}
      </div>
    </div>
  );
}
