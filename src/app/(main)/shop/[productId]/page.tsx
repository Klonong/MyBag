"use client";

import { BasePageCenter } from "@/components/base";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import type { Product, ProductVariant } from "@/interfaces";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HeartIcon, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ui/product-card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";


// Each item: 100px height + 8px gap (gap-2).
// 4 visible items: 4×100 + 3×8 = 424px.
const VIEWPORT_H = "h-[424px]";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Array.isArray(params.productId)
    ? params.productId[0]
    : params.productId;
  const product = products.find((p) => p.id === productId) as Product;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
    setSelectedImageIdx(0);
  }, [product]);

  if (!product) {
    return (
      <BasePageCenter className="px-6 md:px-20 py-8">
        <p className="text-sm text-gray-500">Product not found.</p>
      </BasePageCenter>
    );
  }

  const currentImages: string[] = selectedVariant?.images ?? [
    product.image,
    product.image,
    product.image,
  ];
  const mainImage =
    currentImages[selectedImageIdx] ?? currentImages[0] ?? product.image;

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImageIdx(0);
  };

  const viewLabels = ["Front", "Side", "Back"];
  const router = useRouter();

  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <BasePageCenter className="px-6 md:px-20 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 flex flex-col lg:flex-row lg:justify-center lg:gap-20 xl:gap-30 gap-6 items-start">
        {/* ── Left: thumbnail strip + main image ── */}
        <div className="flex gap-3 items-start w-full lg:shrink-0">
          {/* Vertical thumbnail carousel — only show on lg+ */}
          <div className="hidden lg:block relative py-10">
            <Carousel
              orientation="vertical"
              opts={{ align: "start", containScroll: "trimSnaps" }}
              className={`w-24 ${VIEWPORT_H}`}
            >
              {/* Arrow above */}
              <CarouselPrevious className="left-1/2 -translate-x-1/2 -top-10 rotate-90 border-gray-200 hover:border-black bg-white shadow-sm" />

              <CarouselContent
                viewportClassName={VIEWPORT_H}
                className="mt-0 gap-2"
              >
                {currentImages.map((img, idx) => (
                  <CarouselItem key={idx} className="pt-0 basis-25">
                    <button
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      aria-label={`Select ${viewLabels[idx] ?? `view ${idx + 1}`}`}
                      className={`block w-full h-25 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedImageIdx === idx
                          ? "border-black opacity-100"
                          : "border-transparent opacity-50 hover:opacity-80 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        width={96}
                        height={100}
                        src={img}
                        alt={`${product.name} — ${viewLabels[idx] ?? idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Arrow below */}
              <CarouselNext className="left-1/2 -translate-x-1/2 -bottom-10 rotate-90 border-gray-200 hover:border-black bg-white shadow-sm" />
            </Carousel>
          </div>

          {/* Main image — full width on mobile */}
          <div className="relative w-full aspect-square lg:aspect-[460/520] lg:w-[460px] lg:h-[520px] rounded-2xl overflow-hidden bg-gray-100">
            <Image
              fill
              src={mainImage}
              alt={product.name}
              className="object-cover transition-opacity duration-300"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-semibold tracking-widest">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* Mobile thumbnail dots */}
        <div className="flex lg:hidden justify-center gap-2 mt-4">
          {currentImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIdx(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                selectedImageIdx === idx
                  ? "bg-black w-4"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>

        {/* ── Right: product info ── */}
        <div className="flex-1 lg:max-w-sm pt-1 w-full">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            {product.category}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          <p className="text-sm text-gray-500 mt-2">{product.description}</p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 mt-5">
            {formatPrice(selectedVariant?.price ?? product.price)}
          </p>

          {/* Color swatches */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Color&nbsp;
                <span className="normal-case font-normal tracking-normal text-gray-900">
                  — {selectedVariant?.color}
                </span>
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    title={variant.color}
                    onClick={() => handleVariantSelect(variant)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedVariant?.id === variant.id
                        ? "border-black scale-110 shadow-md"
                        : "border-gray-200 hover:border-gray-400 hover:scale-105"
                    }`}
                    style={{ backgroundColor: variant.colorHex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {product.material && product.material.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Materials
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.material.map((m) => (
                  <span
                    key={m}
                    className="text-xs px-3 py-1.5 bg-gray-100 rounded-full text-gray-600 capitalize"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3 mt-8 lg:mt-10">
            <Button className="flex-1 bg-black text-white hover:bg-gray-800 font-semibold tracking-widest text-xs h-12 rounded-full">
              <ShoppingCart className="w-4 h-4 mr-2" />
              ADD TO CART
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-gray-300 hover:border-black hover:bg-transparent shrink-0"
            >
              <HeartIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Similar Products ── */}
      {similarProducts.length > 0 && (
        <div className="mt-16 lg:mt-20 pt-8 lg:pt-12">
          <Separator className="mb-8 lg:mb-12" />
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              You May Also Like
            </h2>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-black transition-colors"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => router.push(`/shop/${p.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </BasePageCenter>
  );
}
