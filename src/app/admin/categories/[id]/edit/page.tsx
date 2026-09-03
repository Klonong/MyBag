"use client";

import { useParams } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";

export default function EditCategoryPage() {
  const params = useParams<{ id: string }>();
  return <CategoryForm categoryId={Number(params.id)} />;
}
