// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  product: {
    name: string;
    price: number;
    // add other fields if needed
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
addToCart(state, action: PayloadAction<CartItem>) {
  const existingIndex = state.items.findIndex(
    (item) => item.productId === action.payload.productId
  );
  if (existingIndex >= 0) {
    state.items[existingIndex].quantity += action.payload.quantity;
  } else {
    state.items.push(action.payload);
  }
  console.log("Cart after addToCart:", state.items); // <-- Add this
},
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.total = action.payload.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price || 0),
        0
      );
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      state.total = state.items.reduce(
        (sum, item) => sum + item.quantity * (item.product?.price || 0),
        0
      );
    },
    emptyCart(state) {
      state.items = [];
    },
  },
});

export const { setCart, removeFromCart,emptyCart,addToCart } = cartSlice.actions;
export default cartSlice.reducer;
