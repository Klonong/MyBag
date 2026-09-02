"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  X,
  CreditCard,
  Landmark,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { BasePageCenter, RightAsideLayout } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthRequiredDialog } from "@/components/ui/auth-required-dialog";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { cartService, type CartItem as CartApiItem } from "@/services/cart.service";

type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
};

const toCartItemView = (item: CartApiItem): CartItem => {
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

export default function CartPage() {
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

  return (
    <BasePageCenter>
      <RightAsideLayout
        asideWidth="340px"
        className="gap-8 lg:gap-14"
        aside={
          <Card className="overflow-hidden rounded-[1.5rem] border border-[#f0e4df] bg-[#fffdfc] shadow-[0_18px_50px_rgba(97,79,70,0.08)] lg:sticky lg:top-24">
            <CardHeader className="bg-gradient-to-br from-[#fff7f3] to-[#f8efe9] pb-4">
              <CardTitle className="font-headline text-2xl lg:text-4xl text-[#1b1716]">
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#5d5855]">Subtotal</span>
                  <span className="font-medium text-[#1b1716]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5d5855]">Shipping</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8c7369]">
                    Calculated at next step
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5d5855]">Estimated Tax</span>
                  <span className="font-medium text-[#1b1716]">{formatPrice(0)}</span>
                </div>
              </div>

              <Separator className="bg-[#f0e7e3]" />

              <div className="flex items-center justify-between">
                <span className="text-xl lg:text-xl font-semibold text-[#1b1716]">Total</span>
                <span className="font-headline text-2xl lg:text-2xl text-[#1b1716]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <Button
                onClick={() => {
                  if (!user) {
                    setAuthDialogOpen(true);
                  } else {
                    router.push("/checkout");
                  }
                }}
                className="h-12 w-full rounded-full bg-[#1b1716] text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#3b2f2a]"
              >
                Proceed to Checkout
              </Button>

              <p className="text-center text-[11px] uppercase tracking-[0.18em] text-[#8a7d77]">
                Complimentary shipping on orders over {formatPrice(500)}
              </p>

              <div className="flex items-center justify-center gap-4 text-[#b38b7d]">
                <CreditCard className="h-4 w-4" />
                <Landmark className="h-4 w-4" />
                <Truck className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        }
      >
        <section className="px-0 lg:px-4">
          <div className="rounded-[1.75rem] border border-[#f2e3df] bg-linear-to-r from-[#fffaf8] via-[#fff6f2] to-[#f5efe9] p-5 shadow-[0_18px_48px_rgba(101,82,72,0.06)] sm:p-6 lg:p-7">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b86650]">
                  Your collection
                </p>
                <h1 className="mt-2 font-headline text-3xl sm:text-4xl lg:text-5xl leading-none text-[#1d1917]">
                  Your Bag
                </h1>
              </div>
              <div className="inline-flex items-center rounded-full border border-[#f1d8cf] bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6d5d57]">
                {items.length} item{items.length === 1 ? "" : "s"}
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#544d49]">
              Every piece in your archive is handcrafted with intention. Review your selection before proceeding to finalization.
            </p>
          </div>

          {loading ? (
            <div className="mt-8 rounded-[1.5rem] border border-[#f3e8e3] bg-[#fffaf7] px-6 py-12 text-center text-sm text-[#625d5a]">
              Loading your bag...
            </div>
          ) : items.length === 0 ? (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-[#ead7cf] bg-[#fffaf7] p-8 text-center shadow-[0_16px_40px_rgba(98,79,70,0.04)]">
              <p className="text-xl font-semibold text-[#1d1917]">Your bag is empty.</p>
              <p className="mt-2 text-sm text-[#625d5a]">
                Add a few handcrafted pieces to begin your collection.
              </p>
              <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#965f4d] hover:text-[#7d4f42]">
                <ArrowLeft className="h-3.5 w-3.5" />
                Continue browsing
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-2 px-1">
                <Checkbox
                  id="select-all-cart-items"
                  checked={allItemsSelected}
                  onCheckedChange={(checked) => {
                    setSelectedItemIds(checked ? items.map((item) => item.id) : []);
                  }}
                />
                <label
                  htmlFor="select-all-cart-items"
                  className="cursor-pointer text-xs font-semibold uppercase tracking-[0.16em] text-[#6d5d57]"
                >
                  Select all items
                </label>
              </div>
              {items.map((item, index) => (
                <div key={item.id} className="rounded-[1.5rem] border border-[#f1e3de] bg-white p-3 shadow-[0_12px_30px_rgba(93,74,66,0.04)] sm:p-4">
                  <div className="grid grid-cols-[100px_1fr] gap-3 sm:grid-cols-[120px_1fr] sm:gap-4 md:grid-cols-[140px_1fr] md:gap-6">
                    <AspectRatio ratio={1} className="overflow-hidden rounded-[1rem] bg-[#f5efe9]">
                      <Image
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </AspectRatio>

                    <div className="flex min-h-[100px] flex-col sm:min-h-[120px]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id={`cart-item-${item.id}`}
                            checked={selectedItemIds.includes(item.id)}
                            onCheckedChange={(checked) => {
                              setSelectedItemIds((current) =>
                                checked
                                  ? [...current, item.id]
                                  : current.filter((id) => id !== item.id),
                              );
                            }}
                            className="mt-1"
                          />
                          <div>
                            <h2 className="text-base font-semibold tracking-tight text-[#1d1917] sm:text-lg md:text-xl">
                              {item.name}
                            </h2>
                            <p className="mt-1 text-xs italic text-[#7a706d] sm:text-sm">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f1e4df] bg-[#fffaf7] text-[#5e524f] transition-colors hover:bg-[#f6eee9]"
                            type="button"
                            aria-label={`Remove ${item.name}`}
                          >
                            <X className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Remove item?</DialogTitle>
                              <DialogDescription>
                                {item.name} will be removed from your bag.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" type="button">Cancel</Button>
                              <Button
                                variant="destructive"
                                type="button"
                                onClick={() => {
                                  void removeItem(item.id);
                                }}
                              >
                                Remove
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="mt-auto flex flex-col items-start justify-between gap-3 pt-3 sm:flex-row sm:items-end sm:pt-4">
                        <div className="inline-flex items-center overflow-hidden rounded-full border border-[#f1e4df] bg-[#fffaf7]">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                              void decreaseQty(item.id);
                            }}
                            className="h-9 w-9 rounded-none border-0 bg-transparent text-[#332d2b] hover:bg-[#f5eee8]"
                            type="button"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-9 text-center text-sm font-medium text-[#1f1b1a]">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => {
                              void increaseQty(item.id);
                            }}
                            className="h-9 w-9 rounded-none border-0 bg-transparent text-[#332d2b] hover:bg-[#f5eee8]"
                            type="button"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <div className="text-left sm:text-right">
                          {item.originalPrice && (
                            <p className="text-xs text-[#a19690] line-through sm:text-sm">
                              {formatPrice(item.originalPrice)}
                            </p>
                          )}
                          <p className="text-lg font-semibold leading-none text-[#1d1917] sm:text-xl md:text-2xl">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < items.length - 1 && <Separator className="mt-5 bg-[#f2e7e2]" />}
                </div>
              ))}
            </div>
          )}

          <Link
            href="/shop"
            className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b625f] transition-colors hover:text-[#1d1917] lg:mt-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue exploring the collection
          </Link>
        </section>
      </RightAsideLayout>

      <AuthRequiredDialog
        open={authDialogOpen}
        onClose={() => setAuthDialogOpen(false)}
        message="Please sign in to proceed to checkout."
        redirectPath="/checkout"
      />
    </BasePageCenter>
  );
}
