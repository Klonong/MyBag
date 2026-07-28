"use client";

import { useMemo, useState } from "react";
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
import { BasePageCenter, RightAsideLayout } from "@/components/base";
import { Button } from "@/components/ui/button";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { increaseQty, decreaseQty, removeFromCart } from "@/store/cartSlice";

export default function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user } = useAuth();

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const increaseItemQty = (id: string) => dispatch(increaseQty(id));
  const decreaseItemQty = (id: string) => dispatch(decreaseQty(id));
  const removeItem = (id: string) => dispatch(removeFromCart(id));

  const router = useRouter();

  return (
    <BasePageCenter>
      <RightAsideLayout
        asideWidth="340px"
        className="gap-8 lg:gap-14"
        aside={
          <Card className="border border-gray-200 rounded-xl shadow-none bg-white lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="font-headline text-2xl lg:text-4xl">
                Order Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    Calculated at next step
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estimated Tax</span>
                  <span className="font-medium">{formatPrice(0)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-xl lg:text-2xl font-semibold">Total</span>
                <span className="font-headline text-2xl lg:text-5xl">
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
                className="w-full h-11 rounded-full lg:rounded-none uppercase tracking-[0.18em] font-semibold bg-black text-white hover:bg-zinc-800"
              >
                Proceed to Checkout
              </Button>

              <p className="text-center text-xs text-gray-500">
                Complimentary shipping on orders over {formatPrice(500)}
              </p>

              <div className="flex items-center justify-center gap-4 text-gray-400">
                <CreditCard className="h-4 w-4" />
                <Landmark className="h-4 w-4" />
                <Truck className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        }
      >
        <section className="px-0 lg:px-4">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl leading-none">
            Your Bag
          </h1>
          <p className="text-sm text-gray-700 mt-3 max-w-xl">
            Every piece in your archive is handcrafted with intention. Review
            your selection before proceeding to finalization.
          </p>

          <div className="mt-8 space-y-6">
            {items.map((item, index) => (
              <div key={item.id}>
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] md:grid-cols-[140px_1fr] gap-3 sm:gap-4 md:gap-6 items-start">
                  <AspectRatio
                    ratio={1}
                    className="overflow-hidden rounded-md bg-muted"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>

                  <div className="flex flex-col min-h-[100px] sm:min-h-[120px]">
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <div>
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold tracking-tight">
                          {item.name}
                        </h2>
                        <p className="text-xs sm:text-sm italic text-gray-500 mt-1">
                          {item.subtitle}
                        </p>
                      </div>

                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-full"
                            />
                          }
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove {item.name}</span>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove item?</DialogTitle>
                            <DialogDescription>
                              {item.name} will be removed from your bag.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button
                              variant="destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pt-3 sm:pt-4">
                      <div className="inline-flex items-center border rounded-md overflow-hidden h-9 sm:h-10">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => decreaseItemQty(item.id)}
                          className="rounded-none h-full"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 sm:w-9 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => increaseItemQty(item.id)}
                          className="rounded-none h-full"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="text-right">
                        {item.originalPrice && (
                          <p className="text-xs sm:text-sm text-gray-400 line-through">
                            {formatPrice(item.originalPrice)}
                          </p>
                        )}
                        <p className="text-lg sm:text-xl md:text-2xl font-semibold leading-none">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {index < items.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="mt-8 lg:mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue Exploring the Collection
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
