"use client";

import { useParams } from "next/navigation";
import { DiscountForm } from "@/components/admin/discount-form";

export default function EditDiscountPage() {
  const params = useParams<{ id: string }>();
  return <DiscountForm discountId={Number(params.id)} />;
}
