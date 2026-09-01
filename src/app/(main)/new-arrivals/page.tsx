"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { BasePage } from "@/components/base";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { normalizeShopProduct } from "@/hooks/useShopProducts";
import type { Product } from "@/interfaces";
import { productsService } from "@/services/products.service";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const result = await productsService.getProductList({
        page: 1,
        limit: 12,
        sort: "newest",
      });

      if (!result.error && result.data) {
        setProducts((result.data.items ?? []).map(normalizeShopProduct));
      }

      setIsLoading(false);
    };

    void loadProducts();
  }, []);

  const heroProduct = products[0];

  return (
    <BasePage>
      <section className="mb-8 overflow-hidden rounded-[2rem] border border-[#efeae5] bg-[#fcfaf8]">
        <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8d746a]">
              Fresh drop
            </p>
            <h1 className="font-headline text-4xl font-bold leading-none text-[#1d1d1b] sm:text-5xl lg:text-6xl">
              New Arrivals
            </h1>
            <p className="max-w-xl text-sm leading-7 text-[#53514d] sm:text-base">
              Discover the latest pieces shaped by new artisan collaborations, seasonal color stories, and everyday silhouettes refined for modern movement.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button className="h-11 rounded-full bg-[#1d1d1b] px-6 text-xs font-semibold tracking-[0.18em] text-white hover:bg-[#3a3a34]">
                  BROWSE ALL
                </Button>
              </Link>
              <Link href="/shop?sort=newest">
                <Button variant="outline" className="h-11 rounded-full border-[#d8d2cc] bg-white px-6 text-xs font-semibold tracking-[0.18em] text-[#1d1d1b] hover:bg-[#f7f5f2]">
                  LATEST DROP
                </Button>
              </Link>
            </div>
          </div>

          {heroProduct ? (
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[#f0e3df] bg-white p-3 shadow-[0_20px_60px_rgba(77,57,49,0.08)]">
              <div className="relative overflow-hidden rounded-[1.2rem]">
                <Image
                  src={heroProduct.image || "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=900&fit=crop"}
                  alt={heroProduct.name}
                  width={900}
                  height={900}
                  className="h-[360px] w-full object-cover sm:h-[430px]"
                />
                <div className="absolute left-4 top-4 rounded-full bg-[#1d1d1b] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white">
                  New
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8d746a]">
                    Just arrived
                  </p>
                  <h2 className="mt-2 font-headline text-2xl font-bold text-[#1d1d1b]">
                    {heroProduct.name}
                  </h2>
                </div>
                <Link href={`/shop/${heroProduct.id}`}>
                  <Button size="icon" className="h-11 w-11 rounded-full bg-[#1d1d1b] text-white hover:bg-[#3a3a34]">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#8d746a]">
            <Flame className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">
              Recent additions
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-[#efeae5] bg-[#fcfaf8] px-6 py-12 text-center text-sm text-[#625d5a]">
            Loading new arrivals...
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => {}} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#efeae5] bg-[#fcfaf8] px-6 py-12 text-center text-sm text-[#625d5a]">
            No recent arrivals yet.
          </div>
        )}
      </section>
    </BasePage>
  );
}
