"use client";

import { ArrowLeft, CreditCard, Landmark, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { PaymentData, PaymentMethod } from "./types";

const PAYMENT_METHODS: {
  value: PaymentMethod;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}[] = [
  { value: "card", icon: CreditCard, label: "Credit/Debit Card" },
  { value: "bank", icon: Landmark, label: "Bank Transfer" },
  { value: "wallet", icon: Wallet, label: "Digital Wallet" },
];

export function PaymentStep({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: PaymentData;
  onChange: (d: Partial<PaymentData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isValid =
    data.method !== "card" ||
    (!!data.nameOnCard &&
      data.cardNumber.length >= 16 &&
      !!data.expiry &&
      !!data.cvv);

  return (
    <div>
      <h1 className="font-headline text-4xl font-semibold text-primary mb-1">
        Secure Payment
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Please select your preferred payment method and provide details below.
      </p>

      <div className="mb-6">
        <p className="text-xs tracking-widest font-semibold text-primary uppercase mb-3">
          Payment Method
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {PAYMENT_METHODS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ method: value })}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 rounded-lg border text-center transition-all",
                data.method === value
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-muted-foreground",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
                  data.method === value ? "text-primary" : "text-muted-foreground",
                )}
                strokeWidth={1.5}
              />
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium transition-colors leading-tight",
                  data.method === value ? "text-primary" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Credit/Debit Card form */}
      {data.method === "card" && (
        <div className="space-y-4">
          <div>
            <Label className="block text-xs tracking-widest font-semibold text-primary uppercase mb-1.5">
              Name on Card
            </Label>
            <Input
              placeholder="ALEXANDRA K."
              value={data.nameOnCard}
              onChange={(e) => onChange({ nameOnCard: e.target.value })}
              className="h-11"
            />
          </div>
          <div>
            <Label className="block text-xs tracking-widest font-semibold text-primary uppercase mb-1.5">
              Card Number
            </Label>
            <div className="relative">
              <Input
                placeholder="0000 0000 0000 0000"
                value={data.cardNumber}
                maxLength={19}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const formatted = raw.match(/.{1,4}/g)?.join(" ") ?? raw;
                  onChange({ cardNumber: formatted });
                }}
                className="h-11 pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                <div className="w-8 h-5 rounded bg-muted-foreground/20" />
                <div className="w-8 h-5 rounded bg-muted-foreground/20" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label className="block text-xs tracking-widest font-semibold text-primary uppercase mb-1.5">
                Expiry Date
              </Label>
              <Input
                placeholder="MM / YY"
                value={data.expiry}
                maxLength={7}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const formatted =
                    raw.length > 2 ? `${raw.slice(0, 2)} / ${raw.slice(2)}` : raw;
                  onChange({ expiry: formatted });
                }}
                className="h-11"
              />
            </div>
            <div>
              <Label className="block text-xs tracking-widest font-semibold text-primary uppercase mb-1.5">
                CVV
              </Label>
              <Input
                placeholder="•••"
                value={data.cvv}
                maxLength={4}
                type="password"
                onChange={(e) =>
                  onChange({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
                className="h-11"
              />
            </div>
          </div>
          <div className="flex items-start gap-2.5 mt-1">
            <Checkbox
              id="save-card"
              checked={data.saveCard}
              onCheckedChange={(checked) => onChange({ saveCard: !!checked })}
            />
            <Label
              htmlFor="save-card"
              className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
            >
              Save this card for future purchases.{" "}
              <span className="text-tertiary">
                Your payment data is encrypted and secure.
              </span>
            </Label>
          </div>
        </div>
      )}

      {data.method === "bank" && (
        <div className="rounded-lg border border-input p-5 bg-secondary/20 space-y-3">
          <p className="text-sm font-medium text-primary">Bank Transfer Details</p>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>
              Bank: <span className="text-primary font-medium">BCA</span>
            </p>
            <p>
              Account No.:{" "}
              <span className="text-primary font-medium">1234 5678 9012</span>
            </p>
            <p>
              Account Name:{" "}
              <span className="text-primary font-medium">PT MyBag INDONESIA</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Transfer within 24 hours to avoid order cancellation. Upload your
            proof of payment after checkout.
          </p>
        </div>
      )}

      {data.method === "wallet" && (
        <div className="rounded-lg border border-input p-4 sm:p-5 bg-secondary/20 space-y-3">
          <p className="text-sm font-medium text-primary">Select Digital Wallet</p>
          <div className="grid grid-cols-3 gap-2">
            {["GoPay", "OVO", "Dana"].map((w) => (
              <div
                key={w}
                className="border border-input rounded-md py-2.5 sm:py-3 text-center text-xs sm:text-sm text-primary font-medium cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
              >
                {w}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Shipping
        </button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="px-8 h-11 tracking-widest text-xs"
        >
          REVIEW ORDER
        </Button>
      </div>
    </div>
  );
}
