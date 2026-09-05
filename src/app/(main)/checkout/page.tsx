"use client";

import { BasePage, RightAsideLayout } from "@/components/base";
import { StepIndicator } from "./_components/step-indicator";
import { OrderSummary } from "./_components/order-summary";
import { ShippingStep } from "./_components/shipping-step";
import { PaymentStep } from "./_components/payment-step";
import { ReviewStep } from "./_components/review-step";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";

export default function CheckoutPage() {
  const {
    step,
    setStep,
    shippingData,
    updateShipping,
    paymentData,
    updatePayment,
    items,
    shippingSubmitting,
    isShippingValid,
    isReady,
    handleShippingNext,
    couponCode,
    setCouponCode,
    appliedCode,
    couponError,
    applyingCoupon,
    applyCoupon,
    preview,
    previewLoading,
  } = useCheckout();

  if (!isReady) return null;

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
            <OrderSummary
              shippingMethod={shippingData.deliveryMethod}
              items={items}
              preview={preview}
              previewLoading={previewLoading}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCode={appliedCode}
              couponError={couponError}
              applyingCoupon={applyingCoupon}
              applyCoupon={applyCoupon}
            />
            <div className="lg:hidden mt-6">
              <Button
                onClick={handleShippingNext}
                disabled={shippingSubmitting || !isShippingValid}
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
              onChange={updateShipping}
              onNext={handleShippingNext}
              isSubmitting={shippingSubmitting}
            />
          )}
          {step === 1 && (
            <PaymentStep
              data={paymentData}
              onChange={updatePayment}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <ReviewStep
              shipping={shippingData}
              payment={paymentData}
              items={items}
              preview={preview}
              previewLoading={previewLoading}
              couponCode={appliedCode}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </RightAsideLayout>
    </BasePage>
  );
}
