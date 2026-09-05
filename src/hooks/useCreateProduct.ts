"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  createProduct,
  getAdminFormData,
  type AdminSelectItem,
  type ColorInput,
} from "@/app/admin/create-product/actions";
import { uploadFiles } from "@/services/upload.service";

export type ColorEntry = {
  id: string;
  name: string;
  hexCode: string;
  stock: string;
  files: File[];
  previews: string[];
};

export function newColor(): ColorEntry {
  return {
    id: crypto.randomUUID(),
    name: "",
    hexCode: "#c8a882",
    stock: "",
    files: [],
    previews: [],
  };
}

export const useCreateProduct = () => {
  const [categories, setCategories] = useState<AdminSelectItem[]>([]);
  const [badges, setBadges] = useState<AdminSelectItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Basic fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [badgeId, setBadgeId] = useState("");

  // Product-level images
  const [productFiles, setProductFiles] = useState<File[]>([]);
  const [productPreviews, setProductPreviews] = useState<string[]>([]);
  const productInputRef = useRef<HTMLInputElement>(null);

  // Colors
  const [colors, setColors] = useState<ColorEntry[]>([newColor()]);

  useEffect(() => {
    getAdminFormData().then(({ categories, badges }) => {
      setCategories(categories);
      setBadges(badges);
      if (categories[0]) setCategoryId(String(categories[0].id));
      if (badges[0]) setBadgeId(String(badges[0].id));
    });
  }, []);

  // ── product images ──────────────────────────────────────────────
  function handleProductFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files);
    setProductFiles((prev) => [...prev, ...arr]);
    arr.forEach((f) => {
      const url = URL.createObjectURL(f);
      setProductPreviews((prev) => [...prev, url]);
    });
  }

  function removeProductImage(idx: number) {
    URL.revokeObjectURL(productPreviews[idx]);
    setProductFiles((prev) => prev.filter((_, i) => i !== idx));
    setProductPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── colors ──────────────────────────────────────────────────────
  function updateColor(id: string, patch: Partial<ColorEntry>) {
    setColors((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function addColorFiles(colorId: string, files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files);
    const previews = arr.map((f) => URL.createObjectURL(f));
    setColors((prev) =>
      prev.map((c) =>
        c.id === colorId
          ? {
              ...c,
              files: [...c.files, ...arr],
              previews: [...c.previews, ...previews],
            }
          : c
      )
    );
  }

  function removeColorImage(colorId: string, idx: number) {
    setColors((prev) =>
      prev.map((c) => {
        if (c.id !== colorId) return c;
        URL.revokeObjectURL(c.previews[idx]);
        return {
          ...c,
          files: c.files.filter((_, i) => i !== idx),
          previews: c.previews.filter((_, i) => i !== idx),
        };
      })
    );
  }

  function addColor() {
    setColors((prev) => [...prev, newColor()]);
  }

  function removeColor(id: string) {
    setColors((prev) => {
      const color = prev.find((c) => c.id === id);
      color?.previews.forEach((url) => URL.revokeObjectURL(url));
      return prev.filter((c) => c.id !== id);
    });
  }

  // ── submit ───────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !description || !price || !categoryId || !badgeId) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (productFiles.length === 0) {
      toast.error("Add at least one product image.");
      return;
    }
    for (const color of colors) {
      if (!color.name || !color.hexCode) {
        toast.error("Each color needs a name and hex code.");
        return;
      }
    }

    setSubmitting(true);
    try {
      // Upload product images
      const productImageUrls = await uploadFiles(
        productFiles,
        `products/main`
      );

      // Upload color images
      const colorInputs: ColorInput[] = await Promise.all(
        colors.map(async (color) => {
          const imageUrls =
            color.files.length > 0
              ? await uploadFiles(
                  color.files,
                  `products/colors/${color.name.toLowerCase().replace(/\s+/g, "-")}`
                )
              : [];
          return {
            name: color.name,
            hexCode: color.hexCode,
            stock: Number(color.stock) || 0,
            imageUrls,
          };
        })
      );

      const result = await createProduct({
        name,
        description,
        price: Number(price),
        discount: discount ? Number(discount) : undefined,
        categoryId: Number(categoryId),
        badgeId: Number(badgeId),
        productImageUrls,
        colors: colorInputs,
      });

      if (result.success) {
        toast.success(result.message);
        // Reset form
        setName("");
        setDescription("");
        setPrice("");
        setDiscount("");
        productPreviews.forEach((url) => URL.revokeObjectURL(url));
        setProductFiles([]);
        setProductPreviews([]);
        setColors([newColor()]);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    categories,
    badges,
    submitting,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    discount,
    setDiscount,
    categoryId,
    setCategoryId,
    badgeId,
    setBadgeId,
    productPreviews,
    productInputRef,
    handleProductFiles,
    removeProductImage,
    colors,
    updateColor,
    addColorFiles,
    removeColorImage,
    addColor,
    removeColor,
    handleSubmit,
  };
};
