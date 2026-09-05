"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { PackagePlus, Plus, Trash2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useCreateProduct } from "@/hooks/useCreateProduct";

const labelClass =
  "block text-[0.65rem] font-semibold tracking-widest text-zinc-400 mb-1.5";
const inputClass =
  "rounded-md border border-zinc-200 bg-white focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900";
const selectClass =
  "w-full h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900";

export default function CreateProductPage() {
  const {
    categories,
    badges,
    submitting,
    name,
    setName,
    description,
    setDescription,
    price,
    setPrice,
    discount,
    setDiscount,
    categoryId,
    setCategoryId,
    badgeId,
    setBadgeId,
    productPreviews,
    productInputRef,
    handleProductFiles,
    removeProductImage,
    colors,
    updateColor,
    addColorFiles,
    removeColorImage,
    addColor,
    removeColor,
    handleSubmit,
  } = useCreateProduct();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <PackagePlus className="size-6 text-tertiary" />
          <h1 className="font-headline text-3xl font-bold text-zinc-900">
            Create Product
          </h1>
        </div>
        <p className="text-sm text-zinc-500 ml-9">
          Add a new product with images and color variants.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Basic Info ─────────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5">
          <h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
            Basic Information
          </h2>

          <div>
            <Label className={labelClass}>
              PRODUCT NAME <span className="text-red-400">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Batik Tote Bag"
              className={inputClass}
            />
          </div>

          <div>
            <Label className={labelClass}>
              DESCRIPTION <span className="text-red-400">*</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product, craftsmanship, and materials..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className={labelClass}>
                PRICE (IDR) <span className="text-red-400">*</span>
              </Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min={1}
                placeholder="e.g. 3450000"
                className={inputClass}
              />
            </div>
            <div>
              <Label className={labelClass}>DISCOUNT (IDR)</Label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min={0}
                placeholder="e.g. 500000"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className={labelClass}>
                CATEGORY <span className="text-red-400">*</span>
              </Label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>
                  Select category…
                </option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className={labelClass}>
                BADGE <span className="text-red-400">*</span>
              </Label>
              <select
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>
                  Select badge…
                </option>
                {badges.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── Product Images ─────────────────────────────────── */}
        <section className="bg-white rounded-xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
            Product Images
          </h2>
          <p className="text-xs text-zinc-400">
            General product photos shown on listing and detail pages.
          </p>

          {/* Upload area */}
          <button
            type="button"
            onClick={() => productInputRef.current?.click()}
            className="w-full border-2 border-dashed border-zinc-200 rounded-lg p-6 flex flex-col items-center gap-2 hover:border-zinc-400 hover:bg-zinc-50 transition-colors"
          >
            <Upload className="size-6 text-zinc-400" />
            <span className="text-sm text-zinc-500">
              Click to upload images
            </span>
            <span className="text-xs text-zinc-400">
              PNG, JPG, WEBP — multiple allowed
            </span>
          </button>
          <input
            ref={productInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleProductFiles(e.target.files)}
          />

          {productPreviews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {productPreviews.map((url, idx) => (
                <div key={idx} className="relative group aspect-square">
                  <Image
                    src={url}
                    alt={`Product image ${idx + 1}`}
                    fill
                    className="object-cover rounded-md border border-zinc-100"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => removeProductImage(idx)}
                    className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Colors & Variants ──────────────────────────────── */}
        <section className="bg-white rounded-xl border border-zinc-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
                Color Variants
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Each variant has its own images, like Shopee&apos;s color selection.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addColor}
              className="gap-1.5 text-xs"
            >
              <Plus className="size-3.5" />
              Add Color
            </Button>
          </div>

          <div className="space-y-6">
            {colors.map((color, colorIdx) => (
              <div
                key={color.id}
                className="border border-zinc-100 rounded-xl p-5 space-y-4 bg-zinc-50/50"
              >
                {/* Color header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                    Color {colorIdx + 1}
                  </span>
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(color.id)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <Label className={labelClass}>COLOR NAME *</Label>
                    <Input
                      value={color.name}
                      onChange={(e) =>
                        updateColor(color.id, { name: e.target.value })
                      }
                      placeholder="e.g. Midnight Black"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>HEX CODE *</Label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={color.hexCode}
                        onChange={(e) =>
                          updateColor(color.id, { hexCode: e.target.value })
                        }
                        className="size-10 rounded-md border border-zinc-200 cursor-pointer p-0.5 bg-white"
                      />
                      <Input
                        value={color.hexCode}
                        onChange={(e) =>
                          updateColor(color.id, { hexCode: e.target.value })
                        }
                        placeholder="#000000"
                        className={`${inputClass} font-mono text-sm`}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className={labelClass}>STOCK</Label>
                    <Input
                      type="number"
                      min={0}
                      value={color.stock}
                      onChange={(e) =>
                        updateColor(color.id, { stock: e.target.value })
                      }
                      placeholder="0"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Color images */}
                <div>
                  <Label className={labelClass}>COLOR IMAGES</Label>
                  <label
                    htmlFor={`color-img-${color.id}`}
                    className="flex items-center gap-2 w-fit cursor-pointer border border-dashed border-zinc-300 rounded-lg px-4 py-2.5 text-sm text-zinc-500 hover:border-zinc-500 hover:bg-zinc-50 transition-colors"
                  >
                    <ImageIcon className="size-4" />
                    Upload images for this color
                  </label>
                  <input
                    id={`color-img-${color.id}`}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addColorFiles(color.id, e.target.files)}
                  />

                  {color.previews.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {color.previews.map((url, imgIdx) => (
                        <div key={imgIdx} className="relative group aspect-square">
                          <Image
                            src={url}
                            alt={`Color ${colorIdx + 1} image ${imgIdx + 1}`}
                            fill
                            className="object-cover rounded-md border border-zinc-100"
                            unoptimized
                          />
                          <button
                            type="button"
                            onClick={() => removeColorImage(color.id, imgIdx)}
                            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Submit ─────────────────────────────────────────── */}
        <div className="flex justify-end pb-8">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 text-white text-sm font-semibold tracking-widest px-8 py-3 rounded-md transition-colors disabled:opacity-60"
          >
            {submitting && <Spinner className="size-4" />}
            {submitting ? "SAVING…" : "CREATE PRODUCT"}
          </button>
        </div>
      </form>
    </div>
  );
}
