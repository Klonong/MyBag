"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BasePageCenter } from "@/components/base";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeFromWishlist } from "@/store/wishlistSlice";

export default function WishlistPage() {
  const productIds = useAppSelector((state) => state.wishlist.productIds);
  const dispatch = useAppDispatch();
  const wishlistProducts = products.filter((p) => productIds.includes(p.id));
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/wishlist");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <BasePageCenter>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-muted-foreground mb-1">
            Your Curated Collection
          </p>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl">
            Wishlist
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {wishlistProducts.length} items Stored
          </p>
          <Button variant="default" size="sm" className="hidden sm:flex">
            Move All to Cart
          </Button>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {wishlistProducts.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className="group relative rounded-lg overflow-hidden border border-secondary/60 hover:shadow-md transition-shadow"
          >
            <AspectRatio ratio={1}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </AspectRatio>
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(removeFromWishlist(product.id));
              }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            >
              <Heart className="w-4 h-4 text-tertiary fill-tertiary" />
            </button>
            <div className="p-2 sm:p-3 bg-card">
              <p className="font-medium text-primary text-xs sm:text-sm truncate">
                {product.name}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 sm:hidden">
        <Button variant="default" className="w-full">
          Move All to Cart
        </Button>
      </div>
    </BasePageCenter>
  );
}
