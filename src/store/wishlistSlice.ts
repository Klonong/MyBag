import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { products } from "@/data/products";

type WishlistState = {
  productIds: string[];
};

// Starter demo wishlist (previously a fixed slice of the product catalog).
const initialState: WishlistState = {
  productIds: products.slice(0, 4).map((p) => p.id),
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist(state, action: PayloadAction<string>) {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      if (state.productIds.includes(action.payload)) {
        state.productIds = state.productIds.filter((id) => id !== action.payload);
      } else {
        state.productIds.push(action.payload);
      }
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
