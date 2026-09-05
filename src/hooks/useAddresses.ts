"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { addressService, type Address, type CreateAddressInput } from "@/services/address.service";

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

const toEditForm = (address: Address): CreateAddressInput => ({
  label: address.label ?? "",
  recipientName: address.recipient_name,
  phone: address.phone,
  addressLine: address.address_line,
  addressLine2: address.address_line2 ?? "",
  city: address.city,
  province: address.province,
  postalCode: address.postal_code,
  country: address.country,
  isDefault: address.is_default,
});

export const useAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CreateAddressInput>(emptyForm);
  const [savingEdit, setSavingEdit] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/profile/addresses");
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) return;

    const fetchAddresses = async () => {
      const result = await addressService.list();
      if (result.error) toast.error(result.error.message || "Unable to load addresses.");
      setAddresses(result.data ?? []);
    };

    void fetchAddresses();
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
      const createdAddress = result.data;
      setAddresses((current) =>
        form.isDefault
          ? [createdAddress, ...current.map((address) => ({ ...address, is_default: false }))]
          : [...current, createdAddress],
      );
      setForm(emptyForm);
      toast.success("Address saved.");
    }
    setSubmitting(false);
  };

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setEditForm(toEditForm(address));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const updateEditForm = (key: keyof CreateAddressInput, value: string | boolean) => {
    setEditForm((current) => ({ ...current, [key]: value }));
  };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) return;
    setSavingEdit(true);
    const result = await addressService.update(editingId, editForm);
    if (result.error) {
      toast.error(result.error.message || "Unable to update address.");
    } else if (result.data) {
      const updatedAddress = result.data;
      setAddresses((current) =>
        current.map((address) =>
          address.id === updatedAddress.id
            ? updatedAddress
            : editForm.isDefault
              ? { ...address, is_default: false }
              : address,
        ),
      );
      toast.success("Address updated.");
      cancelEdit();
    }
    setSavingEdit(false);
  };

  const removeAddress = async (id: string) => {
    setBusyId(id);
    const result = await addressService.remove(id);
    if (result.error) {
      toast.error(result.error.message || "Unable to remove address.");
    } else {
      setAddresses((current) => current.filter((address) => address.id !== id));
      toast.success("Address removed.");
    }
    setBusyId(null);
  };

  const setDefaultAddress = async (id: string) => {
    setBusyId(id);
    const result = await addressService.setDefault(id);
    if (result.error) {
      toast.error(result.error.message || "Unable to set default address.");
    } else {
      setAddresses((current) =>
        current.map((address) => ({ ...address, is_default: address.id === id })),
      );
      toast.success("Default address updated.");
    }
    setBusyId(null);
  };

  return {
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
  };
};
