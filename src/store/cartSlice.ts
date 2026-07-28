import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { products } from "@/data/products";

export type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
};

type CartState = {
  items: CartItem[];
};

// Starter demo cart (previously local component state).
const initialState: CartState = {
  items: [
    {
      id: "1",
      name: "THE ARTISAN CARRYALL",
      subtitle: "Ebony / Natural Grain Leather",
      price: 385,
      originalPrice: 450,
      quantity: 1,
      image: products[0]?.image ?? "",
    },
    {
      id: "2",
      name: "TERRACOTTA SLING",
      subtitle: "Limited Edition / Hand-woven",
      price: 210,
      quantity: 1,
      image: products[1]?.image ?? "",
    },
  ],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>
    ) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity ?? 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity ?? 1 });
      }
    },
    increaseQty(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQty(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity = Math.max(1, item.quantity - 1);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, increaseQty, decreaseQty, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
