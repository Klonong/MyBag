"use client";

import { Form } from "@base-ui/react";
import { ArrowLeft, Plus, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { categoryService } from "@/services/category.service";
import { badgesService, type Badge } from "@/services/badges.service";
import { productsService, type UpdateProductColorInput } from "@/services/products.service";
import type { CategoryItem } from "@/interfaces";

type ColorRow = {
  key: string;
  id?: number;
  name: string;
  hexCode: string;
  stock: string;
  imageUrls: string[];
  newImageUrl: string;
};

let rowKeySeq = 0;
const nextRowKey = () => `color-${++rowKeySeq}`;

export function ProductEditForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [colors, setColors] = useState<ColorRow[]>([]);
  const [removeColorIds, setRemoveColorIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([categoryService.getCategories(), badgesService.list()]).then(
      ([categoriesResult, badgesResult]) => {
        setCategories(categoriesResult.data ?? []);
        setBadges(badgesResult.data ?? []);
      },
    );
  }, []);

  useEffect(() => {
    void productsService.getProductById(productId).then((result) => {
      if (result.error) {
        setError(result.error.message);
      } else if (result.data) {
        const product = result.data;
        setName(product.name);
        setDescription(product.description ?? "");
        setPrice(String(product.price ?? ""));
        setDiscount(String(product.discount ?? ""));
        setCategoryId(product.categories?.id !== undefined ? String(product.categories.id) : "");
        setBadgeId(product.badges?.id !== undefined ? String(product.badges.id) : "");
        setColors(
          (product.product_colors ?? []).map((color) => ({
            key: nextRowKey(),
            id: typeof color.id === "number" ? color.id : Number(color.id),
            name: color.name ?? "",
            hexCode: color.hex_code ?? "",
            stock: String(color.stock ?? 0),
            imageUrls: (color.product_color_images ?? [])
              .map((image) => image.image_url)
              .filter((url): url is string => Boolean(url)),
            newImageUrl: "",
          })),
        );
      } else {
        setError("Product not found.");
      }
      setLoading(false);
    });
  }, [productId]);

  function updateColor(key: string, patch: Partial<ColorRow>) {
    setColors((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addColorImage(key: string) {
    setColors((current) =>
      current.map((row) => {
        if (row.key !== key || !row.newImageUrl.trim()) return row;
        return { ...row, imageUrls: [...row.imageUrls, row.newImageUrl.trim()], newImageUrl: "" };
      }),
    );
  }

  function removeColorImage(key: string, index: number) {
    setColors((current) =>
      current.map((row) =>
        row.key === key ? { ...row, imageUrls: row.imageUrls.filter((_, i) => i !== index) } : row,
      ),
    );
  }

  function addColorRow() {
    setColors((current) => [
      ...current,
      { key: nextRowKey(), name: "", hexCode: "", stock: "0", imageUrls: [], newImageUrl: "" },
    ]);
  }

  function removeColorRow(key: string) {
    setColors((current) => {
      const row = current.find((item) => item.key === key);
      if (row?.id !== undefined) {
        setRemoveColorIds((ids) => [...ids, row.id!]);
      }
      return current.filter((item) => item.key !== key);
    });
  }

  async function submit() {
    if (!name.trim() || !price) {
      setError("Product name and price are required.");
      return;
    }

    for (const row of colors) {
      if (row.id === undefined && (!row.stock || row.imageUrls.length === 0)) {
        setError("New colors need a stock count and at least one image URL.");
        return;
      }
    }

    setSaving(true);
    setError(null);

    const colorInputs: UpdateProductColorInput[] = colors.map((row) => ({
      ...(row.id !== undefined && { id: row.id }),
      name: row.name || undefined,
      hexCode: row.hexCode || undefined,
      stock: row.stock ? Number(row.stock) : undefined,
      imageUrls: row.imageUrls,
    }));

    const result = await productsService.updateProduct(productId, {
      name: name.trim(),
      description,
      price: Number(price),
      discount: Number(discount) || 0,
      ...(categoryId && { categoryId: Number(categoryId) }),
      ...(badgeId && { badgeId: Number(badgeId) }),
      colors: colorInputs,
      ...(removeColorIds.length > 0 && { removeColorIds }),
    });
    setSaving(false);
    if (result.error) setError(result.error.message);
    else window.location.href = "/admin/products";
  }

  const labelClass = "text-xs font-semibold uppercase tracking-wider text-zinc-500";
  const selectClass =
    "h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900";

  return (
    <div className="max-w-3xl space-y-7">
      <Button variant="ghost" nativeButton={false} render={<Link href="/admin/products" />}>
        <ArrowLeft /> Back to products
      </Button>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-tertiary">Catalog</p>
        <h1 className="font-headline text-4xl font-bold">Edit product</h1>
        <p className="mt-2 text-sm text-zinc-500">Update the product information shown in your store.</p>
      </div>

      <Form onFormSubmit={submit} className="space-y-8 border border-zinc-200 bg-white p-6">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading product...</p>
        ) : (
          <>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product name</Label>
                <Input id="product-name" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price</Label>
                  <Input
                    id="product-price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-discount">Discount</Label>
                  <Input
                    id="product-discount"
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(event) => setDiscount(event.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className={labelClass}>Category</Label>
                  <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled>Select category…</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Badge</Label>
                  <select
                    value={badgeId}
                    onChange={(event) => setBadgeId(event.target.value)}
                    className={selectClass}
                  >
                    <option value="">No badge</option>
                    {badges.map((badge) => (
                      <option key={badge.id} value={badge.id}>{badge.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-zinc-100 pt-6">
              <div className="flex items-center justify-between">
                <Label className={labelClass}>Color variants</Label>
                <Button type="button" variant="outline" size="sm" onClick={addColorRow} className="gap-1.5 text-xs">
                  <Plus className="size-3.5" /> Add color
                </Button>
              </div>

              <div className="space-y-5">
                {colors.map((row) => (
                  <div key={row.key} className="space-y-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                        {row.id !== undefined ? `Color #${row.id}` : "New color"}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeColorRow(row.key)}
                        className="p-1 text-zinc-400 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="col-span-2 sm:col-span-1">
                        <Label className={labelClass}>Name</Label>
                        <Input
                          value={row.name}
                          onChange={(event) => updateColor(row.key, { name: event.target.value })}
                          placeholder="e.g. Midnight Black"
                        />
                      </div>
                      <div>
                        <Label className={labelClass}>Hex code</Label>
                        <Input
                          value={row.hexCode}
                          onChange={(event) => updateColor(row.key, { hexCode: event.target.value })}
                          placeholder="#000000"
                        />
                      </div>
                      <div>
                        <Label className={labelClass}>Stock</Label>
                        <Input
                          type="number"
                          min="0"
                          value={row.stock}
                          onChange={(event) => updateColor(row.key, { stock: event.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className={labelClass}>Image URLs</Label>
                      <div className="mt-1.5 flex gap-2">
                        <Input
                          value={row.newImageUrl}
                          onChange={(event) => updateColor(row.key, { newImageUrl: event.target.value })}
                          placeholder="https://..."
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => addColorImage(row.key)}>
                          Add
                        </Button>
                      </div>
                      {row.imageUrls.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {row.imageUrls.map((url, index) => (
                            <li key={`${row.key}-${index}`} className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                              <span className="truncate">{url}</span>
                              <button
                                type="button"
                                onClick={() => removeColorImage(row.key, index)}
                                className="shrink-0 text-zinc-400 hover:text-red-500"
                              >
                                <X className="size-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : <><Save /> Save product</>}
              </Button>
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
