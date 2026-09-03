"use client";

import { useParams } from "next/navigation";
import { ProductEditForm } from "@/components/admin/product-edit-form";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  return <ProductEditForm productId={params.id} />;
}
