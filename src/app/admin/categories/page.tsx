"use client";

import { useEffect, useState } from "react";
import { FolderTree, Plus, Trash2 } from "lucide-react";
import { Form } from "@base-ui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService, type AdminCategory } from "@/services/admin.service";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  useEffect(() => { void adminService.listCategories().then((result) => { if (result.error) setError(result.error.message); else setCategories(result.data ?? []); setLoading(false); }); }, []);
  async function addCategory() { if (!name.trim()) return; const result = await adminService.createCategory(name.trim()); if (result.error || !result.data) { setError(result.error?.message ?? "Unable to create category."); return; } setCategories((current) => [...current, result.data as AdminCategory]); setName(""); }
  async function deleteCategory(id: number) { const result = await adminService.deleteCategory(id); if (result.error) { setError(result.error.message); return; } setCategories((current) => current.filter((item) => item.id !== id)); }
  return <div className="space-y-7"><div><div className="mb-3 flex size-11 items-center justify-center bg-tertiary/10 text-tertiary"><FolderTree className="size-5" /></div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog structure</p><h1 className="font-headline text-4xl font-bold">Categories</h1><p className="mt-2 text-sm text-zinc-500">Organize your collection so customers can browse it naturally.</p></div><div className="flex gap-2"><Form onFormSubmit={addCategory} className="flex max-w-lg flex-1 gap-2"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="New category name" aria-label="New category name" /><Button type="submit"><Plus /> Add category</Button></Form><Button variant="outline" nativeButton={false} render={<Link href="/admin/categories/new" />}>Create page</Button></div>{error && <p className="text-sm text-red-500">{error}</p>}<div className="overflow-hidden border border-zinc-200 bg-white"><Table><TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Products</TableHead><TableHead>Last updated</TableHead><TableHead className="w-32" /></TableRow></TableHeader><TableBody>{loading ? <TableRow><TableCell colSpan={4} className="text-center">Loading categories...</TableCell></TableRow> : categories.map((category) => <TableRow key={category.id}><TableCell className="font-medium">{category.name}</TableCell><TableCell className="text-zinc-500">{category.productCount ?? category.products ?? 0}</TableCell><TableCell className="text-zinc-500">{category.updatedAt ?? category.updated ?? "-"}</TableCell><TableCell><div className="flex items-center justify-end gap-1"><Button size="icon-sm" variant="ghost" nativeButton={false} render={<Link href={`/admin/categories/${category.id}/edit`} />} aria-label={`Edit ${category.name}`}>Edit</Button><Button size="icon-sm" variant="ghost" aria-label={`Delete ${category.name}`} onClick={() => void deleteCategory(category.id)}><Trash2 className="size-4 text-zinc-400" /></Button></div></TableCell></TableRow>)}</TableBody></Table></div></div>;
}
