import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '../../api/services/product/productApi';

const initialState = {
  items: [
  ], // [{ id, name, quantity }]
  productForm: {
    // name: '',
    // quantity: 0,
    // // Add more fields as needed
  }
};


export const fetchInventoryData = createAsyncThunk(
  'product/getProducts',
  async () => {
    const data = await getProducts();
    console.log("data==>>", data);
    return data.data;
  }
);

const productSlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {

    setProductForm(state, action) {
      state.productForm = action.payload;
    },

    // Optionally merge fields into form (if needed)
    updateProductForm(state, action) {
      state.productForm = {
        ...state.productForm,
        ...action.payload,
      };
    },


    addItem: {
      reducer(state, action) {
        console.log("action.payload", action.payload);
        state.items.push({id: action.payload.id, ...action.payload.name});
      },
      prepare(name, quantity) {
        return {
          payload: {
            id: nanoid(),
            name,
            quantity,
          }
        };
      }
    },
    removeItem(state, action) {
      console.log("action.payload", action.payload);
      console.log("state.items", state.items);
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryData.fulfilled, (state, action) => {
        console.log("action.payload", action.payload);
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchInventoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
    }
});

export const { 
  addItem, 
  removeItem, 
  updateQuantity,
  updateProductFormField,
  setProductForm
 } = productSlice.actions;
export default productSlice.reducer;
