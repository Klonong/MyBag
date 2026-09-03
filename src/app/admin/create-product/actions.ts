"use server";

import { revalidatePath } from "next/cache";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

const demoCategories: AdminSelectItem[] = [
  { id: 1, name: "Tote" }, { id: 2, name: "Crossbody" }, { id: 3, name: "Shoulder" }, { id: 4, name: "Backpacks" }, { id: 5, name: "Clutches" },
];
const demoBadges: AdminSelectItem[] = [
  { id: 1, name: "LIMITED" }, { id: 2, name: "BESTSELLER" },
];

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

function readSelectItems(body: unknown): AdminSelectItem[] {
  if (Array.isArray(body)) return body as AdminSelectItem[];

  if (body && typeof body === "object" && "data" in body) {
    const data = body.data;
    return Array.isArray(data) ? (data as AdminSelectItem[]) : [];
  }

  return [];
}

export async function getAdminFormData(): Promise<{
  categories: AdminSelectItem[];
  badges: AdminSelectItem[];
}> {
  const [categoriesRes, badgesRes] = await Promise.all([
    fetch(`${API_URL}/categories`, { cache: "no-store" }),
    fetch(`${API_URL}/badges`, { cache: "no-store" }),
  ]);

  const categories = categoriesRes.ok
    ? readSelectItems(await categoriesRes.json())
    : [];
  const badges = badgesRes.ok ? readSelectItems(await badgesRes.json()) : [];

  return {
    categories: categories.length ? categories : demoCategories,
    badges: badges.length ? badges : demoBadges,
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
