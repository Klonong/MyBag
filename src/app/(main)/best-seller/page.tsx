"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Truck } from "lucide-react";
import { BasePage } from "@/components/base";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { useBestSellers } from "@/hooks/useBestSellers";

export default function BestSellerPage() {
  const { isLoading, featuredProduct, remainingProducts } = useBestSellers();

  return (
    <BasePage>
      <section className="relative overflow-hidden rounded-[2rem] border border-[#f1e2dd] bg-[#f9f1ee] px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-[#f5d8cf]/60 to-transparent lg:block" />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#b8654b]">
              Best sellers
            </p>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-[#1d1d1b] sm:text-5xl lg:text-6xl">
              The bags customers keep coming back for.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#4a4a45] sm:text-base">
              Built for everyday rituals, refined enough for special occasions, and loved for the way they carry your life with ease.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop">
                <Button className="h-11 rounded-full bg-[#1d1d1b] px-6 text-xs font-semibold tracking-[0.18em] text-white hover:bg-[#3a3a34]">
                  SHOP THE EDIT
                </Button>
              </Link>
              <Link href="/shop?sort=best_seller">
                <Button variant="outline" className="h-11 rounded-full border-[#d9b0a2] bg-white/70 px-6 text-xs font-semibold tracking-[0.18em] text-[#1d1d1b] hover:bg-white">
                  VIEW MORE
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-[#3b3b38]">
              <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-2">
                <Star className="h-4 w-4 fill-[#d68b5c] text-[#d68b5c]" />
                4.9 average rating
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-2">
                <Truck className="h-4 w-4 text-[#b8654b]" />
                Ships in 48 hours
              </div>
            </div>
          </div>

          {featuredProduct ? (
            <div className="relative rounded-[1.5rem] border border-[#edd5ce] bg-white p-3 shadow-[0_30px_80px_rgba(156,106,94,0.12)]">
              <div className="relative overflow-hidden rounded-[1.25rem]">
                <Image
                  src={featuredProduct.image || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1100&fit=crop"}
                  alt={featuredProduct.name}
                  width={900}
                  height={1100}
                  className="h-[420px] w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b8654b]">
                    Customer favorite
                  </p>
                  <h2 className="mt-2 font-headline text-2xl font-bold text-[#1d1d1b]">
                    {featuredProduct.name}
                  </h2>
                </div>
                <Link href={`/shop/${featuredProduct.id}`}>
                  <Button size="icon" className="h-11 w-11 rounded-full bg-[#1d1d1b] text-white hover:bg-[#3a3a34]">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b8654b]">
              Loved by customers
            </p>
            <h2 className="font-headline text-3xl font-bold text-[#1d1d1b] sm:text-4xl">
              Best-sellers in the archive
            </h2>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#f0d7d0] bg-[#fffaf8] px-3 py-2 text-xs font-medium text-[#5e514d] sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-[#b8654b]" />
            Handmade with intention
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-[#f1e2dd] bg-[#fffaf8] px-6 py-12 text-center text-sm text-[#625d5a]">
            Loading best sellers...
          </div>
        ) : remainingProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {remainingProducts.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#f1e2dd] bg-[#fffaf8] px-6 py-12 text-center text-sm text-[#625d5a]">
            No best sellers available right now.
          </div>
        )}
      </section>
    </BasePage>
  );
}
