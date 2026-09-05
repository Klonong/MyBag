"use client";

import { MapPin, Plus, Star, Pencil, Trash2, X } from "lucide-react";
import { BasePage } from "@/components/base";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Address, CreateAddressInput } from "@/services/address.service";
import { useAddresses } from "@/hooks/useAddresses";

export default function AddressPage() {
  const {
    addresses,
    form,
    submitting,
    user,
    loading,
    update,
    createAddress,
    editingId,
    editForm,
    savingEdit,
    busyId,
    startEdit,
    cancelEdit,
    updateEditForm,
    submitEdit,
    removeAddress,
    setDefaultAddress,
  } = useAddresses();

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

  const editField = (key: keyof CreateAddressInput, label: string, required = true) => (
    <div className="space-y-1.5">
      <Label htmlFor={`edit-${key}`}>{label}{!required && " (optional)"}</Label>
      <Input
        id={`edit-${key}`}
        required={required}
        value={String(editForm[key] ?? "")}
        onChange={(event) => updateEditForm(key, event.target.value)}
      />
    </div>
  );

  const renderAddress = (address: Address) => {
    if (editingId === address.id) {
      return (
        <Card key={address.id}>
          <CardContent className="p-5">
            <form onSubmit={submitEdit} className="space-y-4">
              {editField("label", "Label", false)}
              {editField("recipientName", "Recipient name")}
              {editField("phone", "Phone")}
              {editField("addressLine", "Address line")}
              {editField("addressLine2", "Address line 2", false)}
              <div className="grid gap-4 sm:grid-cols-2">
                {editField("city", "City")}
                {editField("province", "Province")}
                {editField("postalCode", "Postal code")}
                {editField("country", "Country", false)}
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={editForm.isDefault}
                  onCheckedChange={(checked) => updateEditForm("isDefault", !!checked)}
                />
                Make this my default address
              </label>
              <div className="flex gap-2">
                <Button type="submit" disabled={savingEdit} className="flex-1">
                  {savingEdit ? "Saving..." : "Save changes"}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    }

    const busy = busyId === address.id;

    return (
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
            {address.is_default && (
              <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">Default</span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {!address.is_default && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void setDefaultAddress(address.id)}
              >
                <Star className="mr-1.5 h-3.5 w-3.5" />
                Set as default
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => startEdit(address)}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => {
                if (window.confirm("Remove this address?")) void removeAddress(address.id);
              }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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
          ) : addresses.map(renderAddress)}
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
