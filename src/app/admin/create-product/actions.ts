"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/auth/guards";
import {
  getAdminFormData as fetchAdminFormData,
  createProductRecord,
  type AdminSelectItem,
  type CreateProductInput,
} from "@/server/products/product.service";

export type { AdminSelectItem, ColorInput, CreateProductInput } from "@/server/products/product.service";

export type CreateProductState = {
  success: boolean;
  message: string;
};

export async function getAdminFormData(): Promise<{
  categories: AdminSelectItem[];
  badges: AdminSelectItem[];
}> {
  await requireAdmin();
  return fetchAdminFormData();
}

export async function createProduct(
  input: CreateProductInput
): Promise<CreateProductState> {
  try {
    await requireAdmin();
    await createProductRecord(input);

    revalidatePath("/shop");
    return { success: true, message: `Product "${input.name}" created successfully!` };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create product.";
    return { success: false, message };
  }
}
