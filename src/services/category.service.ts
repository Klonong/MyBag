import { api } from "@/lib/api";
import type { CategoryItem } from "@/interfaces";

export const categoryService = {
  getCategories: () => api.get<CategoryItem[]>("/categories"),
};
