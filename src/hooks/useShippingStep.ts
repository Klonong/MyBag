"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addressService, type Address } from "@/services/address.service";
import type { ShippingData } from "@/app/(main)/checkout/_components/types";

export const useShippingStep = (
  data: ShippingData,
  onChange: (d: Partial<ShippingData>) => void,
) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  useEffect(() => {
    void addressService.list().then((result) => {
      if (result.error) {
        toast.error(result.error.message || "Unable to load saved addresses.");
        return;
      }
      setSavedAddresses(result.data ?? []);
    });
  }, []);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddress(addr.id);
    setShowForm(false);
    onChange({
      addressId: addr.id,
      fullName: addr.recipient_name,
      phone: addr.phone,
      address: addr.address_line,
      address2: addr.address_line2 ?? "",
      city: addr.city,
      province: addr.province,
      postalCode: addr.postal_code,
      country: addr.country,
    });
  };

  const handleEnterNewAddress = () => {
    setSelectedAddress(null);
    setShowForm(true);
  };

  const isValid = Boolean(
    data.fullName && data.address && data.city && data.postalCode && (data.addressId || data.email),
  );

  return {
    selectedAddress,
    showForm,
    savedAddresses,
    handleSelectAddress,
    handleEnterNewAddress,
    isValid,
  };
};
