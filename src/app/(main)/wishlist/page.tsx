"use client";

import { BasePageCenter } from "@/components/base";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { items, loading, user, authLoading, handleRemove } = useWishlist();

  if (authLoading || !user) return null;

  return (
    <BasePageCenter>
      <div className="rounded-[2rem] border border-[#f1e5e0] bg-gradient-to-r from-[#fffaf8] via-[#fff6f2] to-[#f5efe9] p-5 shadow-[0_18px_45px_rgba(103,82,73,0.06)] sm:p-6 lg:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b86650]">
              Your curated collection
            </p>
            <h1 className="mt-2 font-headline text-3xl sm:text-4xl lg:text-5xl text-[#1d1917]">
              Wishlist
            </h1>
          </div>
          <div className="inline-flex items-center rounded-full border border-[#f1d8cf] bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6d5d57]">
            {items.length} saved item{items.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <Separator className="my-6 bg-[#f1e5e0]" />

      {loading ? (
        <div className="mt-4 rounded-[1.5rem] border border-[#f3e8e3] bg-[#fffaf7] px-6 py-12 text-center text-sm text-[#625d5a]">
          Loading your wishlist...
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-[1.75rem] border border-dashed border-[#ead7cf] bg-[#fffaf7] p-8 text-center shadow-[0_16px_40px_rgba(98,79,70,0.04)]">
          <p className="text-xl font-semibold text-[#1d1917]">Your wishlist is empty.</p>
          <p className="mt-2 text-sm text-[#625d5a]">
            Save a few pieces you love to revisit later.
          </p>
          <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#965f4d] hover:text-[#7d4f42]">
            Discover the collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
          {items.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-[1.35rem] border border-[#f1e3de] bg-white shadow-[0_12px_30px_rgba(93,74,66,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(93,74,66,0.08)]"
            >
              <Link href={`/shop/${product.id}`} className="block">
                <AspectRatio ratio={1} className="overflow-hidden bg-[#f5efe9]">
                  <Image
                    src={product.image || "/placeholder-product.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  void handleRemove(product.wishlistId);
                }}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white"
                aria-label={`Remove ${product.name} from wishlist`}
              >
                <Heart className="h-4 w-4 fill-[#c56d5f] text-[#c56d5f]" />
              </button>

              <div className="space-y-1 p-3 sm:p-4">
                <p className="truncate text-sm font-medium text-[#221d1b] sm:text-base">
                  {product.name}
                </p>
                <p className="text-xs text-[#7a706d] sm:text-sm">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 sm:hidden">
        <Button variant="default" className="w-full rounded-full bg-[#1d1917] text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#3a2f2c]">
          Move All to Cart
        </Button>
      </div>
    </BasePageCenter>
  );
}
