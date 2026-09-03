"use client";

import { useParams } from "next/navigation";
import { OrderForm } from "@/components/admin/order-form";

export default function EditOrderPage() {
  const params = useParams<{ id: string }>();
  return <OrderForm orderId={params.id} />;
}
