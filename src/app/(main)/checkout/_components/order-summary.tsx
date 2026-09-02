"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "./types";

export function OrderSummary({
  shippingMethod,
  items,
}: {
  shippingMethod: "standard" | "express";
  items: CartItem[];
}) {
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = 0;
  const discount = applied ? Math.round(subtotal * 0.1) : 0;
  const taxable = subtotal - discount;
  const tax = 0;
  const total = taxable + shippingFee + tax;

  return (
    <aside className="bg-secondary/30 rounded-xl p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="font-headline text-xl sm:text-2xl font-semibold text-primary mb-4 sm:mb-5">
        Order Summary
      </h2>

      <div className="space-y-4 mb-5">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 sm:gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden shrink-0 bg-muted">
              <AspectRatio ratio={1}>
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </AspectRatio>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-primary text-xs sm:text-sm leading-snug">{item.name}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{item.variant}</p>
              <div className="flex justify-between items-end mt-1 sm:mt-2">
                <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                <span className="text-sm font-medium text-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="mb-4" />

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {applied && (
          <div className="flex justify-between text-tertiary">
            <span>Promo (ESTETIKA10)</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping ({shippingMethod === "express" ? "Express" : "Standard"})</span>
          <span>{shippingFee ? formatPrice(shippingFee) : "Calculated by API"}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Estimated Tax</span>
          <span>{tax ? formatPrice(tax) : "Calculated by API"}</span>
        </div>
      </div>

      <Separator className="mb-4" />

      <div className="flex justify-between items-center mb-5">
        <span className="text-xs tracking-widest font-semibold text-primary uppercase">
          Total
        </span>
        <span className="font-headline text-xl font-bold text-primary">
          {formatPrice(total)}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-xs tracking-widest font-semibold text-primary uppercase mb-2">
          Promo Code
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="MyBag10"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            className="text-sm h-10 flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 sm:px-4 text-xs tracking-widest"
            onClick={() => {
              if (promo.toUpperCase() === "ESTETIKA10") setApplied(true);
            }}
          >
            APPLY
          </Button>
        </div>
        {applied && (
          <p className="text-xs text-tertiary mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 10% discount applied
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs mt-4">
        <Lock className="w-3 h-3" />
        <span className="tracking-wide uppercase">SSL Secure Payment Encryption</span>
      </div>
    </aside>
  );
}
