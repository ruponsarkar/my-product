import { createSlice, createAsyncThunk, createEntityAdapter, createSelector, nanoid } from '@reduxjs/toolkit'

// adapter normalizes collection and gives helpful selectors
const productsAdapter = createEntityAdapter({
//   sortComparer: (a, b) => a.name.localeCompare(b.name),
  sortComparer: (a, b) => a.title.localeCompare(b.title),
})

const initialState = productsAdapter.getInitialState({
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
})

// Example async thunk to fetch products from backend (replace endpoint)
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const res = await fetch('https://dummyjson.com/products') // replace with your API
  if (!res.ok) throw new Error('Failed to fetch')
//   return res.products // should be an array of products
    const data = await res.json(); // wait for the response to be parsed
    console.log("res ", data.products); // now this will log the actual parsed JSON object
  return data.products // should be an array of products
})

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // payload = product object {id, name, price, quantity, ...}
    productAdded: productsAdapter.addOne,
    // payload = { id, changes: { ... } }
    productUpdated: productsAdapter.updateOne,
    // payload = id
    productRemoved: productsAdapter.removeOne,
    // custom stock adjusters
    stockIncremented(state, action) {
      const { id, amount = 1 } = action.payload
      const p = state.entities[id]
      if (p) p.quantity = (p.quantity || 0) + amount
    },
    stockDecremented(state, action) {
      const { id, amount = 1 } = action.payload
      const p = state.entities[id]
      if (p) p.quantity = Math.max(0, (p.quantity || 0) - amount)
    },
    // convenience: add product locally with generated id
    productAddedLocal: {
      reducer: productsAdapter.addOne,
      prepare(product) {
        return { payload: { id: nanoid(), ...product } }
      }
    },
    testAction(state, action){
        console.log("action here==>", action.payload);
        // const product = state.entities[12]; 
        // console.log("state here==>", product.title);
        const allProducts = Object.values(state.entities);
        // console.log("allProducts here==>", allProducts);
        console.log("allProducts2:", JSON.parse(JSON.stringify(state.entities)));
        const product = allProducts.find(p => p?.title === "Annibale Colombo Bed");
        // console.log("product here==>", structuredClone(product));
        console.log("Product:", JSON.parse(JSON.stringify(product)));
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading' })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // payload expected: array of products
        productsAdapter.setAll(state, action.payload)
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
})

export const {
  productAdded,
  productAddedLocal,
  productUpdated,
  productRemoved,
  stockIncremented,
  stockDecremented,
  testAction
} = productsSlice.actions

export default productsSlice.reducer

// Adapter selectors:
export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds
} = productsAdapter.getSelectors((state) => state.products)

// Derived selector: total inventory value
export const selectTotalInventoryValue = createSelector(
  selectAllProducts,
  (products) => products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0)
)
