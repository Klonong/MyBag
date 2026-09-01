"use client";

import type { Product } from "@/interfaces";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cartService } from "@/services/cart.service";
import { authService } from "@/services/auth.service";
import { wishlistService } from "@/services/wishlist.service";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!user || loading) return;

    const syncWishlistState = async () => {
      const result = await wishlistService.getWishlist();
      if (result.error) {
        setIsSaved(false);
        return;
      }

      const saved = (result.data?.items ?? []).some(
        (item) => item.product?.id === product.id,
      );
      setIsSaved(saved);
    };

    void syncWishlistState();
  }, [loading, product.id, user]);

  const handleAddToCart = async () => {
    const defaultVariant = product.variants?.[0];
    const parsedColorId = Number.parseInt(String(defaultVariant?.id ?? "1"), 10);

    const result = await cartService.addItem({
      productId: product.id,
      colorId: Number.isNaN(parsedColorId) ? 1 : parsedColorId,
      quantity: 1,
    });

    if (result.error) {
      toast.error(result.error.message || "Unable to add item to cart.");
      return;
    }

    toast.success(`${product.name} added to your bag.`);
  };

  const handleWishlistToggle = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (loading) {
      return;
    }

    let currentUser = user;
    if (!currentUser) {
      await refresh();
      const me = await authService.getMe();
      currentUser = me.data?.user ?? null;
    }

    if (!currentUser) {
      router.push("/login?redirect=/shop");
      return;
    }

    if (isSaved) {
      const result = await wishlistService.getWishlist();
      if (result.error) {
        toast.error(result.error.message || "Unable to load wishlist.");
        return;
      }

      const savedItem = (result.data?.items ?? []).find(
        (item) => item.product?.id === product.id,
      );

      if (!savedItem?.id) {
        toast.error("Wishlist item not found.");
        return;
      }

      const removeResult = await wishlistService.removeItem(savedItem.id);
      if (removeResult.error) {
        toast.error(removeResult.error.message || "Unable to remove item from wishlist.");
        return;
      }

      setIsSaved(false);
      toast.success(`${product.name} removed from wishlist.`);
      return;
    }

    const result = await wishlistService.addItem(product.id);
    if (result.error) {
      toast.error(result.error.message || "Unable to add item to wishlist.");
      return;
    }

    setIsSaved(true);
    toast.success(`${product.name} added to wishlist.`);
  };

  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {product.badge && (
          <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-semibold tracking-wider">
            {product.badge}
          </div>
        )}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2">{product.description}</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
        <div>
          <Button
            className="bg-white text-black font-semibold tracking-wider cursor-pointer"
            size="sm"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void handleAddToCart();
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
          <Button
            className="bg-white text-black font-semibold tracking-wider cursor-pointer"
            size="sm"
            type="button"
            aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            onClick={handleWishlistToggle}
          >
            <HeartIcon className={`w-4 h-4 ${isSaved ? "fill-current text-red-500" : "text-current"}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
