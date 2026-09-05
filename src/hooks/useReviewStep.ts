"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cartService } from "@/services/cart.service";
import { orderService, type Order } from "@/services/order.service";
import type { CartItem, ShippingData, PaymentData } from "@/app/(main)/checkout/_components/types";

export const useReviewStep = (
  shipping: ShippingData,
  payment: PaymentData,
  items: CartItem[],
  couponCode: string | null,
) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async () => {
    if (submitting || !items.length) return;
    setSubmitting(true);
    setError(null);
    const result = await orderService.createSummary({
      cartItemIds: [...new Set(items.map((item) => item.id))],
      ...(shipping.addressId ? { addressId: shipping.addressId } : {}),
      deliveryMethod: shipping.deliveryMethod,
      paymentMethod: payment.method,
      ...(couponCode ? { couponCode } : {}),
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

  return { order, submitting, error, submitOrder };
};
