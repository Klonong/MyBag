"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BasePage, RightAsideLayout } from "@/components/base";
import { StepIndicator } from "./_components/step-indicator";
import { OrderSummary } from "./_components/order-summary";
import { ShippingStep } from "./_components/shipping-step";
import { PaymentStep } from "./_components/payment-step";
import { ReviewStep } from "./_components/review-step";
import { Button } from "@/components/ui/button";
import { defaultShipping, defaultPayment } from "./_components/types";
import type { ShippingData, PaymentData } from "./_components/types";
import useAuth from "@/hooks/useAuth";
import { cartService } from "@/services/cart.service";
import type { CartItem } from "./_components/types";

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingData>(defaultShipping);
  const [paymentData, setPaymentData] = useState<PaymentData>(defaultPayment);
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
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

  if (loading || !user || cartLoading) return null;

  if (!items.length) {
    return <BasePage><p className="py-20 text-center text-muted-foreground">Your cart is empty.</p></BasePage>;
  }

  return (
    <BasePage>
      <StepIndicator current={step} />

      <RightAsideLayout
        asideWidth="340px"
        className="gap-8 lg:gap-10 xl:gap-14"
        aside={
          <div className="flex flex-col">
            <OrderSummary shippingMethod={shippingData.deliveryMethod} items={items} />
            <div className="lg:hidden mt-6">
              <Button
                onClick={() => setStep(1)}
                disabled={!shippingData.fullName || !shippingData.email || !shippingData.address || !shippingData.city || !shippingData.postalCode}
                className="w-full h-12 tracking-widest text-xs bg-black text-white hover:bg-zinc-800 rounded-full lg:rounded-none"
              >
                CONTINUE TO PAYMENT
              </Button>
            </div>
          </div>
        }
      >
        <div className="px-0 lg:px-4">
          {step === 0 && (
            <ShippingStep
              data={shippingData}
              onChange={(d) => setShippingData((prev) => ({ ...prev, ...d }))}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <PaymentStep
              data={paymentData}
              onChange={(d) => setPaymentData((prev) => ({ ...prev, ...d }))}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <ReviewStep
              shipping={shippingData}
              payment={paymentData}
              items={items}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </RightAsideLayout>
    </BasePage>
  );
}
