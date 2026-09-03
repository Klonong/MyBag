"use client";

import { Form } from "@base-ui/react";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminService } from "@/services/admin.service";

export function CategoryForm({ categoryId }: { categoryId?: number }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(Boolean(categoryId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { if (!categoryId) return; void adminService.listCategories().then((result) => { const item = result.data?.find((category) => category.id === categoryId); if (result.error) setError(result.error.message); else if (item) setName(item.name); else setError("Category not found."); setLoading(false); }); }, [categoryId]);
  async function submit() { if (!name.trim()) { setError("Category name is required."); return; } setSaving(true); setError(null); const result = categoryId ? await adminService.updateCategory(categoryId, name.trim()) : await adminService.createCategory(name.trim()); setSaving(false); if (result.error) { setError(result.error.message); return; } router.push("/admin/categories"); }
  return <div className="max-w-2xl space-y-7"><Button variant="ghost" nativeButton={false} render={<a href="/admin/categories" />}><ArrowLeft /> Back to categories</Button><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog structure</p><h1 className="font-headline text-4xl font-bold">{categoryId ? "Edit category" : "Create category"}</h1><p className="mt-2 text-sm text-zinc-500">{categoryId ? "Update how this category appears across the store." : "Create a new collection for your products."}</p></div><Form onFormSubmit={submit} className="space-y-6 border border-zinc-200 bg-white p-6">{loading ? <p className="text-sm text-zinc-500">Loading category...</p> : <><div className="space-y-2"><Label htmlFor="category-name">Category name</Label><Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Tote" /></div>{error && <p className="text-sm text-red-500">{error}</p>}<div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? "Saving..." : <><Save /> {categoryId ? "Save category" : "Create category"}</>}</Button></div></>}</Form></div>;
}
