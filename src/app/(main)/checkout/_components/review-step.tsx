"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { formatPrice } from "@/lib/utils";
import { cartService } from "@/services/cart.service";
import { orderService, type Order } from "@/services/order.service";
import type { CartItem, ShippingData, PaymentData, PaymentMethod } from "./types";

const METHOD_LABEL: Record<PaymentMethod, string> = {
  card: "Credit/Debit Card",
  bank: "Bank Transfer",
  wallet: "Digital Wallet",
};

export function ReviewStep({
  shipping,
  payment,
  items,
  onBack,
}: {
  shipping: ShippingData;
  payment: PaymentData;
  items: CartItem[];
  onBack: () => void;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const submitOrder = async () => {
    if (submitting || !items.length) return;
    setSubmitting(true);
    setError(null);
    const result = await orderService.createSummary({
      cartItemIds: [...new Set(items.map((item) => item.id))],
      ...(shipping.addressId ? { addressId: shipping.addressId } : {}),
      deliveryMethod: shipping.deliveryMethod,
      paymentMethod: payment.method,
    });

    if (result.error) {
      const fallback =
        result.error.status === 400
          ? "Please check your selected items and address."
          : result.error.status === 401
            ? "Your session has expired. Please sign in again."
            : result.error.status === 404
              ? "Your cart could not be found. Please return to your cart."
              : result.error.status === 500
                ? "The order could not be created. Please try again."
                : "Unable to create your order.";
      setError(result.error.message || fallback);
      if (result.error.status === 401) toast.error(fallback);
      setSubmitting(false);
      return;
    }

    setOrder(result.data);
    await cartService.getCart();
    setSubmitting(false);
  };

  if (order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="w-16 h-16 text-tertiary mb-5" strokeWidth={1} />
        <h2 className="font-headline text-3xl font-semibold text-primary mb-2">
          Order Placed!
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mb-2">Order ID: {order.id}</p>
        <p className="text-muted-foreground text-sm max-w-sm mb-8">Status: {order.status}</p>
        <div className="w-full max-w-sm text-left border rounded-lg p-4 mb-8 space-y-2 text-sm">
          <p>Delivery: {order.delivery_method}</p>
          <p>Payment: {order.payment_method}</p>
          <p>Items: {order.order_items.length}</p>
          <Separator />
          <p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(Number(order.subtotal))}</span></p>
          <p className="flex justify-between"><span>Shipping</span><span>{formatPrice(Number(order.shipping_fee))}</span></p>
          <p className="flex justify-between"><span>Tax</span><span>{formatPrice(Number(order.tax))}</span></p>
          <p className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(Number(order.total))}</span></p>
        </div>
        <Link href="/shop">
          <Button className="px-8 h-11 tracking-widest text-xs">
            CONTINUE SHOPPING
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-headline text-4xl font-semibold text-primary mb-1">
        Review Order
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Please review all details before placing your order.
      </p>

      <div className="space-y-6">
        {/* Shipping summary */}
        <div className="rounded-lg border border-input p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs tracking-widest font-semibold text-primary uppercase">
              Shipping Address
            </p>
            <button
              type="button"
              onClick={onBack}
              className="text-xs text-tertiary hover:underline"
            >
              Edit
            </button>
          </div>
          <p className="text-sm text-primary font-medium">{shipping.fullName}</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {shipping.address}
            {shipping.address2 && `, ${shipping.address2}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {shipping.city}, {shipping.province} {shipping.postalCode}
          </p>
          <p className="text-sm text-muted-foreground">{shipping.country}</p>
          <p className="text-sm text-muted-foreground mt-1">{shipping.email}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Delivery:{" "}
            <span className="font-medium text-primary">
              {shipping.deliveryMethod === "express"
                ? "Express (1–2 days)"
                : "Standard (5–7 days)"}
            </span>
          </p>
        </div>

        {/* Payment summary */}
        <div className="rounded-lg border border-input p-5">
          <p className="text-xs tracking-widest font-semibold text-primary uppercase mb-3">
            Payment Method
          </p>
          <p className="text-sm text-primary font-medium">
            {METHOD_LABEL[payment.method]}
          </p>
          {payment.method === "card" && payment.cardNumber && (
            <p className="text-sm text-muted-foreground mt-0.5">
              **** **** **** {payment.cardNumber.replace(/\s/g, "").slice(-4)}
            </p>
          )}
        </div>

        {/* Items + totals */}
        <div className="rounded-lg border border-input p-5">
          <p className="text-xs tracking-widest font-semibold text-primary uppercase mb-4">
            Items ({items.length})
          </p>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="w-14 h-14 rounded-md overflow-hidden shrink-0 bg-muted">
                  <AspectRatio ratio={1}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.variant}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-primary shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>
                Shipping ({shipping.deliveryMethod === "express" ? "Express" : "Standard"})
              </span>
              <span>Calculated by API</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Tax</span>
              <span>Calculated by API</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold text-primary">
              <span className="text-xs tracking-widest uppercase">Total</span>
              <span className="font-headline text-lg">Calculated by API</span>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Payment
        </button>
        <Button
          onClick={() => void submitOrder()}
          disabled={submitting || !items.length}
          className="px-8 h-11 tracking-widest text-xs bg-primary hover:bg-primary/90"
        >
          {submitting ? "PLACING ORDER..." : "PLACE ORDER"}
        </Button>
      </div>
    </div>
  );
}
