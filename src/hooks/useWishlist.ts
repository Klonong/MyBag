"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useWishlistContext } from "@/context/WishlistProvider";
import { wishlistService, type WishlistItem } from "@/services/wishlist.service";

export type WishlistProductCard = {
  wishlistId: string;
  id: string;
  name: string;
  price: number;
  image: string;
};

export const toWishlistView = (item: WishlistItem): WishlistProductCard | null => {
  const product = item.product;
  if (!product) return null;

  const image =
    product.product_images?.[0]?.image_url ??
    product.product_colors?.[0]?.product_color_images?.[0]?.image_url ??
    "";

  return {
    wishlistId: item.id,
    id: product.id,
    name: product.name,
    price: Number(product.finalPrice ?? product.price ?? 0),
    image,
  };
};

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const { refresh: refreshWishlistContext } = useWishlistContext();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/wishlist");
    }
  }, [user, authLoading, router]);

  const loadWishlist = async () => {
    setLoading(true);
    const result = await wishlistService.getWishlist();

    if (result.error) {
      toast.error(result.error.message || "Unable to load wishlist.");
      setItems([]);
      setLoading(false);
      return;
    }

    const nextItems = (result.data?.items ?? [])
      .map(toWishlistView)
      .filter((item): item is WishlistProductCard => Boolean(item));

    setItems(nextItems);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      await loadWishlist();
    };

    void fetchWishlist();
  }, [user]);

  const handleRemove = async (wishlistId: string) => {
    const result = await wishlistService.removeItem(wishlistId);

    if (result.error) {
      toast.error(result.error.message || "Unable to remove item from wishlist.");
      return;
    }

    toast.success("Removed from wishlist.");
    await Promise.all([loadWishlist(), refreshWishlistContext()]);
  };

  return {
    items,
    loading,
    user,
    authLoading,
    handleRemove,
  };
};
