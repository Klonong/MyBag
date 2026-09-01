"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BasePageCenter } from "@/components/base";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { wishlistService, type WishlistItem } from "@/services/wishlist.service";

type WishlistProductCard = {
  wishlistId: string;
  id: string;
  name: string;
  price: number;
  image: string;
};

const toWishlistView = (item: WishlistItem): WishlistProductCard | null => {
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

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
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

    void fetchWishlist();
  }, [user]);

  const handleRemove = async (wishlistId: string) => {
    const result = await wishlistService.removeItem(wishlistId);

    if (result.error) {
      toast.error(result.error.message || "Unable to remove item from wishlist.");
      return;
    }

    toast.success("Removed from wishlist.");
    await loadWishlist();
  };

  if (authLoading || !user) return null;

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
            {items.length} item{items.length === 1 ? "" : "s"} Stored
          </p>
          <Button variant="default" size="sm" className="hidden sm:flex">
            Move All to Cart
          </Button>
        </div>
      </div>
      <Separator className="my-6" />

      {loading ? (
        <div className="mt-6 text-sm text-gray-500">Loading your wishlist...</div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-lg font-medium text-gray-900">Your wishlist is empty.</p>
          <p className="mt-2 text-sm text-gray-500">
            Save a few pieces you love to revisit later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-lg overflow-hidden border border-secondary/60 hover:shadow-md transition-shadow"
            >
              <Link href={`/shop/${product.id}`} className="block">
                <AspectRatio ratio={1}>
                  <Image
                    src={product.image || "/placeholder-product.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </AspectRatio>
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  void handleRemove(product.wishlistId);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                aria-label={`Remove ${product.name} from wishlist`}
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
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 sm:hidden">
        <Button variant="default" className="w-full">
          Move All to Cart
        </Button>
      </div>
    </BasePageCenter>
  );
}
