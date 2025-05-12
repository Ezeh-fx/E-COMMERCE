import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Product {
  _id: string
  name: string
  category: string
  price: number
  stock: number
}

interface ProductState {
  products: Product[]
}

const initialState: ProductState = {
  products: [],
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p._id === action.payload._id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p._id !== action.payload)
    },
  },
})

export const { setProducts, addProduct, updateProduct, deleteProduct } = productSlice.actions
export default productSlice.reducer
