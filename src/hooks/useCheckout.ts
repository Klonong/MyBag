"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { cartService } from "@/services/cart.service";
import { addressService } from "@/services/address.service";
import { orderService, type OrderPreview } from "@/services/order.service";
import { defaultShipping, defaultPayment } from "@/app/(main)/checkout/_components/types";
import type { CartItem, ShippingData, PaymentData } from "@/app/(main)/checkout/_components/types";

const emptyPreview: OrderPreview = { subtotal: 0, shippingFee: 0, tax: 0, discount: 0, total: 0 };

export const useCheckout = () => {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingData>(defaultShipping);
  const [paymentData, setPaymentData] = useState<PaymentData>(defaultPayment);
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [shippingSubmitting, setShippingSubmitting] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    void cartService.getCart().then((result) => {
      if (result.error) toast.error(result.error.message || "Unable to load your cart.");
      setItems(
        (result.data?.items ?? []).map((item) => ({
          id: String(item.id),
          name: item.product?.name ?? "Artisan Bag",
          variant: item.color?.name ?? "Selected variant",
          price: Number(item.product?.finalPrice ?? item.product?.price ?? 0),
          quantity: item.quantity,
          image: item.color?.product_color_images?.[0]?.image_url ?? item.product?.product_images?.[0]?.image_url ?? "",
        })),
      );
      setCartLoading(false);
    });
  }, [user]);

  const updateShipping = (data: Partial<ShippingData>) =>
    setShippingData((prev) => ({ ...prev, ...data }));

  const updatePayment = (data: Partial<PaymentData>) =>
    setPaymentData((prev) => ({ ...prev, ...data }));

  const handleShippingNext = async () => {
    if (shippingData.addressId) {
      setStep(1);
      return;
    }

    setShippingSubmitting(true);
    const result = await addressService.create({
      recipientName: shippingData.fullName,
      phone: shippingData.phone,
      addressLine: shippingData.address,
      addressLine2: shippingData.address2 || undefined,
      city: shippingData.city,
      province: shippingData.province,
      postalCode: shippingData.postalCode,
      country: shippingData.country,
    });
    setShippingSubmitting(false);

    if (result.error || !result.data) {
      toast.error(result.error?.message || "Unable to save your address.");
      return;
    }

    const createdAddress = result.data;
    setShippingData((prev) => ({ ...prev, addressId: createdAddress.id }));
    setStep(1);
  };

  const isShippingValid = Boolean(
    shippingData.fullName &&
      shippingData.address &&
      shippingData.city &&
      shippingData.postalCode &&
      (shippingData.addressId || shippingData.email),
  );

  // ─── Coupon + live preview ────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [preview, setPreview] = useState<OrderPreview>(emptyPreview);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!items.length) {
        setPreview(emptyPreview);
        return;
      }

      setPreviewLoading(true);
      const result = await orderService.preview({
        cartItemIds: [...new Set(items.map((item) => item.id))],
        ...(shippingData.addressId ? { addressId: shippingData.addressId } : {}),
        deliveryMethod: shippingData.deliveryMethod,
        ...(appliedCode ? { couponCode: appliedCode } : {}),
      });
      if (!active) return;
      if (result.data) setPreview(result.data);
      setPreviewLoading(false);
    };

    void run();

    return () => {
      active = false;
    };
  }, [items, shippingData.addressId, shippingData.deliveryMethod, appliedCode]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError(null);
    const result = await orderService.validateCoupon(couponCode.trim(), preview.subtotal);
    setApplyingCoupon(false);

    if (result.error || !result.data?.valid) {
      const message = result.data?.message ?? result.error?.message ?? "Invalid coupon code.";
      setCouponError(message);
      setAppliedCode(null);
      return;
    }

    setAppliedCode(couponCode.trim());
  };

  return {
    step,
    setStep,
    shippingData,
    updateShipping,
    paymentData,
    updatePayment,
    items,
    cartLoading,
    shippingSubmitting,
    isShippingValid,
    isReady: !loading && !!user && !cartLoading,
    handleShippingNext,
    couponCode,
    setCouponCode,
    appliedCode,
    couponError,
    applyingCoupon,
    applyCoupon,
    preview,
    previewLoading,
  };
};
