"use client";

import { Form } from "@base-ui/react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { productsService } from "@/services/products.service";

export function ProductEditForm({ productId }: { productId: string }) {
  const [name, setName] = useState(""); const [description, setDescription] = useState(""); const [price, setPrice] = useState(""); const [discount, setDiscount] = useState(""); const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  useEffect(() => { void productsService.getProductById(productId).then((result) => { if (result.error) setError(result.error.message); else if (result.data) { setName(result.data.name); setDescription(result.data.description ?? ""); setPrice(String(result.data.price ?? "")); setDiscount(String(result.data.discount ?? "")); } else setError("Product not found."); setLoading(false); }); }, [productId]);
  async function submit() { if (!name.trim() || !price) { setError("Product name and price are required."); return; } setSaving(true); setError(null); const result = await productsService.updateProduct(productId, { name: name.trim(), description, price: Number(price), discount: Number(discount) || 0 }); setSaving(false); if (result.error) setError(result.error.message); else window.location.href = "/admin/products"; }
  return <div className="max-w-3xl space-y-7"><Button variant="ghost" nativeButton={false} render={<Link href="/admin/products" />}><ArrowLeft /> Back to products</Button><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog</p><h1 className="font-headline text-4xl font-bold">Edit product</h1><p className="mt-2 text-sm text-zinc-500">Update the product information shown in your store.</p></div><Form onFormSubmit={submit} className="space-y-5 border border-zinc-200 bg-white p-6">{loading ? <p className="text-sm text-zinc-500">Loading product...</p> : <><div className="space-y-2"><Label htmlFor="product-name">Product name</Label><Input id="product-name" value={name} onChange={(event) => setName(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="product-description">Description</Label><Textarea id="product-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={5} /></div><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="product-price">Price</Label><Input id="product-price" type="number" min="0" value={price} onChange={(event) => setPrice(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="product-discount">Discount</Label><Input id="product-discount" type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)} /></div></div>{error && <p className="text-sm text-red-500">{error}</p>}<div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? "Saving..." : <><Save /> Save product</>}</Button></div></>}</Form></div>;
}
