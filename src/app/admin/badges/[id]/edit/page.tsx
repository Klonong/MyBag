"use client";

import { useParams } from "next/navigation";
import { BadgeForm } from "@/components/admin/badge-form";

export default function EditBadgePage() {
  const params = useParams<{ id: string }>();
  return <BadgeForm badgeId={Number(params.id)} />;
}
