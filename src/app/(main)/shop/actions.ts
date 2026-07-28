"use server";

import { getCategories as fetchCategories, type CategoryItem } from "@/server/products/product.service";

export type { CategoryItem } from "@/server/products/product.service";

export async function getCategories(): Promise<CategoryItem[]> {
  return fetchCategories();
}
