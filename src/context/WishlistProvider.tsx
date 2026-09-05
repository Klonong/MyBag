"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { wishlistService, type Wishlist } from "@/services/wishlist.service";
import type { ApiResult } from "@/lib/api";

type WishlistContextType = {
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

function mapFromWishlist(wishlist: Wishlist | null): Map<string, string> {
  const map = new Map<string, string>();
  for (const item of wishlist?.items ?? []) {
    if (item.product?.id) map.set(item.product.id, item.id);
  }
  return map;
}

const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [itemsByProductId, setItemsByProductId] = useState<Map<string, string>>(new Map());

  const applyResult = useCallback((result: ApiResult<Wishlist>) => {
    setItemsByProductId(result.error ? new Map() : mapFromWishlist(result.data));
  }, []);

  const refresh = useCallback(async () => {
    applyResult(await wishlistService.getWishlist());
  }, [applyResult]);

  useEffect(() => {
    if (authLoading || !user) return;
    let active = true;
    wishlistService.getWishlist().then((result) => {
      if (active) applyResult(result);
    });
    return () => {
      active = false;
    };
  }, [user, authLoading, applyResult]);

  const isWishlisted = useCallback(
    (productId: string) => (user ? itemsByProductId.has(productId) : false),
    [itemsByProductId, user],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      const existingId = itemsByProductId.get(productId);

      if (existingId) {
        const result = await wishlistService.removeItem(existingId);
        if (result.error) throw new Error(result.error.message);

        setItemsByProductId((prev) => {
          const next = new Map(prev);
          next.delete(productId);
          return next;
        });
        return false;
      }

      const result = await wishlistService.addItem(productId);
      if (result.error) throw new Error(result.error.message);

      setItemsByProductId(mapFromWishlist(result.data));
      return true;
    },
    [itemsByProductId],
  );

  const value = useMemo(
    () => ({ isWishlisted, toggleWishlist, refresh }),
    [isWishlisted, toggleWishlist, refresh],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlistContext must be used within a WishlistProvider");
  }
  return context;
};

export { WishlistProvider, useWishlistContext };
