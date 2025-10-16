import React, { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "../../api/services/product/productApi";

import ProductForm from "../../features/products2/ProductForm";
import ProductList from "../../features/products2/ProductList";

import {
  addItem,
  removeItem,
  updateQuantity,
  fetchInventoryData,
  updateProductFormField,
  setProductForm
} from "../../features/inventory/productSlice";

export default function Test() {
  const items = useSelector((state) => state.inventory.items);
  const form = useSelector(state => state.inventory.productForm);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);


  const handleChange = (e) => {
    dispatch(setProductForm({
      ...form,
      [e.target.name]: e.target.value
    }));
  };

//   useEffect(() => {
//     const storedItems = localStorage.getItem("items");
//     if (storedItems) {
//       dispatch(addItem(JSON.parse(storedItems)));
//     }
//   }, [dispatch]);

useEffect(() => {
    dispatch(fetchInventoryData());
  }, [dispatch]);

// useEffect(() => {
//     getData();
// }, []);

const getData=async ()=>{
    const response = await getProducts();
    console.log("response", response);
      
}

  return (
    <div>
      {/* <div style={{ padding: 20 }}>
        <h1>Inventory</h1>
        <ProductForm />
        <ProductList />
      </div> */}

      <div>
      <div>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            onChange={ handleChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            onChange={ handleChange}
          />
          <button onClick={() => dispatch(addItem({ name, quantity }))}>
            Add Item
          </button>

        </div>
      </div>

      <div style={{ padding: 20 }}>
        <h2>Inventory</h2>
        <div>
          <input
            type="text"
            placeholder="Item Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            onChange={(e) => setQuantity(e.target.value)}
          />
          <button onClick={() => dispatch(addItem({ name, quantity }))}>
            Add Item
          </button>

        </div>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.name} (Qty: {item.quantity})
              <button onClick={() => dispatch(removeItem(item._id))}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>


      <div>
        {JSON.stringify(form)}
      </div>

      
    </div>
  );
}
