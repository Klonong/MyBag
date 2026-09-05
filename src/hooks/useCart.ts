"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { cartService, type CartItem as CartApiItem } from "@/services/cart.service";

export type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
};

export const toCartItemView = (item: CartApiItem): CartItem => {
  const product = item.product;
  const color = item.color;
  const productImage =
    color?.product_color_images?.[0]?.image_url ??
    product?.product_images?.[0]?.image_url ??
    "";

  return {
    id: String(item.id),
    name: product?.name ?? "Artisan Bag",
    subtitle: color?.name
      ? `Color: ${color.name}`
      : product?.categories?.name
        ? product.categories.name
        : "Handcrafted piece",
    price: Number(product?.finalPrice ?? product?.price ?? 0),
    quantity: item.quantity ?? 1,
    image: productImage,
  };
};

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  const loadCart = async () => {
    setLoading(true);
    const result = await cartService.getCart();

    if (result.error) {
      toast.error(result.error.message || "Unable to load your cart.");
      setItems([]);
      setCartSubtotal(0);
      setLoading(false);
      return;
    }

    const nextItems = (result.data?.items ?? []).map(toCartItemView);
    setItems(nextItems);
    setSelectedItemIds(nextItems.map((item) => item.id));
    setCartSubtotal(Number(result.data?.subtotal ?? 0));
    setLoading(false);
  };

  useEffect(() => {
    const fetchCart = async () => {
      await loadCart();
    };

    void fetchCart();
  }, []);

  const allItemsSelected = items.length > 0 && selectedItemIds.length === items.length;
  const subtotal = useMemo(() => {
    if (allItemsSelected) {
      return cartSubtotal || items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    return items.reduce(
      (sum, item) =>
        selectedItemIds.includes(item.id) ? sum + item.price * item.quantity : sum,
      0,
    );
  }, [allItemsSelected, cartSubtotal, items, selectedItemIds]);

  const refreshCart = async () => {
    await loadCart();
  };

  const increaseQty = async (id: string) => {
    const cartItem = items.find((item) => item.id === id);
    if (!cartItem) return;

    const result = await cartService.updateItem(id, cartItem.quantity + 1);
    if (result.error) {
      toast.error(result.error.message || "Unable to update quantity.");
      return;
    }

    await refreshCart();
  };

  const decreaseQty = async (id: string) => {
    const cartItem = items.find((item) => item.id === id);
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      await removeItem(id);
      return;
    }

    const result = await cartService.updateItem(id, cartItem.quantity - 1);
    if (result.error) {
      toast.error(result.error.message || "Unable to update quantity.");
      return;
    }

    await refreshCart();
  };

  const removeItem = async (id: string) => {
    const result = await cartService.removeItem(id);

    if (result.error) {
      toast.error(result.error.message || "Unable to remove item.");
      return;
    }

    toast.success("Item removed from your bag.");
    await refreshCart();
  };

  const handleCheckoutClick = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    router.push("/checkout");
  };

  return {
    items,
    selectedItemIds,
    setSelectedItemIds,
    loading,
    authDialogOpen,
    setAuthDialogOpen,
    allItemsSelected,
    subtotal,
    increaseQty,
    decreaseQty,
    removeItem,
    handleCheckoutClick,
  };
};
