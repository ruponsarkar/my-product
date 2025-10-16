import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../features/products2/productsSlice'
import inventorySlice from '../features/inventory/productSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    inventory: inventorySlice,
  },
  // middleware/devTools are enabled by default in dev
})
