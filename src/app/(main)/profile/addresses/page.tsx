"use client";

import { FormEvent, useEffect, useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { BasePage } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addressService, type Address, type CreateAddressInput } from "@/services/address.service";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const emptyForm: CreateAddressInput = {
  recipientName: "",
  phone: "",
  addressLine: "",
  addressLine2: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Indonesia",
  label: "",
  isDefault: false,
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/profile/addresses");
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) return;
    void addressService.list().then((result) => {
      if (result.error) toast.error(result.error.message || "Unable to load addresses.");
      setAddresses(result.data ?? []);
    });
  }, [user]);

  const update = (key: keyof CreateAddressInput, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const createAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await addressService.create(form);
    if (result.error) {
      toast.error(result.error.message || "Unable to save address.");
    } else if (result.data) {
      setAddresses((current) =>
        form.isDefault
          ? [result.data!, ...current.map((address) => ({ ...address, is_default: false }))]
          : [...current, result.data!],
      );
      setForm(emptyForm);
      toast.success("Address saved.");
    }
    setSubmitting(false);
  };

  if (loading || !user) return null;

  const field = (key: keyof CreateAddressInput, label: string, required = true) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label}{!required && " (optional)"}</Label>
      <Input
        id={key}
        required={required}
        value={String(form[key] ?? "")}
        onChange={(event) => update(key, event.target.value)}
      />
    </div>
  );

  return (
    <BasePage>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Account</p>
        <h1 className="mt-2 font-headline text-4xl font-semibold text-primary">Your Addresses</h1>
        <p className="mt-2 text-sm text-muted-foreground">Save delivery details for a faster checkout.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-input p-8 text-center text-sm text-muted-foreground">
              No saved addresses yet.
            </div>
          ) : addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-tertiary" />
                    <div>
                      <p className="font-semibold text-primary">{address.label || "Address"}</p>
                      <p className="mt-2 text-sm text-primary">{address.recipient_name}</p>
                      <p className="text-sm text-muted-foreground">{address.phone}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {address.address_line}{address.address_line2 && `, ${address.address_line2}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.province} {address.postal_code}, {address.country}
                      </p>
                    </div>
                  </div>
                  {address.is_default && <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">Default</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-5 sm:p-6">
            <h2 className="font-headline text-2xl font-semibold text-primary">Add New Address</h2>
            <form onSubmit={createAddress} className="mt-5 space-y-4">
              {field("label", "Label", false)}
              {field("recipientName", "Recipient name")}
              {field("phone", "Phone")}
              {field("addressLine", "Address line")}
              {field("addressLine2", "Address line 2", false)}
              <div className="grid gap-4 sm:grid-cols-2">
                {field("city", "City")}
                {field("province", "Province")}
                {field("postalCode", "Postal code")}
                {field("country", "Country", false)}
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={form.isDefault} onCheckedChange={(checked) => update("isDefault", !!checked)} />
                Make this my default address
              </label>
              <Button type="submit" disabled={submitting} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {submitting ? "Saving..." : "Save Address"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </BasePage>
  );
}
