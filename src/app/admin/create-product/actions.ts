"use server";

import { revalidatePath } from "next/cache";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export type CreateProductState = {
  success: boolean;
  message: string;
};

export type AdminSelectItem = {
  id: number;
  name: string;
};

export type ColorInput = {
  name: string;
  hexCode: string;
  stock: number;
  imageUrls: string[];
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  discount?: number;
  categoryId: number;
  badgeId: number;
  productImageUrls: string[];
  colors: ColorInput[];
};

export async function getAdminFormData(): Promise<{
  categories: AdminSelectItem[];
  badges: AdminSelectItem[];
}> {
  const [categoriesRes, badgesRes] = await Promise.all([
    fetch(`${API_URL}/categories`, { cache: "no-store" }),
    fetch(`${API_URL}/badges`, { cache: "no-store" }),
  ]);

  return {
    categories: categoriesRes.ok ? await categoriesRes.json() : [],
    badges: badgesRes.ok ? await badgesRes.json() : [],
  };
}

export async function createProduct(
  input: CreateProductInput
): Promise<CreateProductState> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return {
        success: false,
        message: body?.message ?? "Failed to create product.",
      };
    }

    revalidatePath("/shop");
    return { success: true, message: `Product "${input.name}" created successfully!` };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create product.";
    return { success: false, message };
  }
}
