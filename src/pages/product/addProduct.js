import React, { useState } from "react";
import Input from "../../components/form/input";
import JoditEditorAuto from "../../components/form/JoditEditorAuto";
import Sidebar from "../../components/dashboard/sidebar";
import AddProductForm from "./add-forms";
import Dynamic from "./add-forms/dynamic";

export default function AddProduct() {
  return (
    <>
      <Sidebar>
        <AddProductForm />
      </Sidebar>
    </>
  );
}
