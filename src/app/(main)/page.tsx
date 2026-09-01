"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/product-card";
import { products } from "@/data/products";


const featuredProducts = products.filter((p) => p.badge).slice(0, 4);
const newArrivals = products.slice(0, 4);

const categories = [
  {
    name: "Tote Bags",
    description: "Everyday elegance",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
    href: "/shop?category=tote",
  },
  {
    name: "Crossbody",
    description: "Hands-free style",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
    href: "/shop?category=crossbody",
  },
  {
    name: "Backpacks",
    description: "Function meets form",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    href: "/shop?category=backpacks",
  },
  {
    name: "Clutches",
    description: "Evening essentials",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop",
    href: "/shop?category=clutches",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1920&h=1080&fit=crop"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 py-16">
          <div className="max-w-xl">
            <p className="text-white/80 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-3 sm:mb-4">
              New Collection 2024
            </p>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 sm:mb-6">
              The Art of Indonesian Craftsmanship
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md">
              Each piece tells a story of generations of mastery, from the hands of
              skilled artisans across the Indonesian archipelago.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/shop">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90 h-11 sm:h-12 px-6 sm:px-8 tracking-widest text-xs font-semibold">
                  SHOP COLLECTION
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white text-black h-11 sm:h-12 px-6 sm:px-8 tracking-widest text-xs font-semibold"
                >
                  OUR STORY
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
          <span className="text-white/60 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-white/40" />
        </div>
      </section>

      {/* ── Featured Categories ───────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-tertiary mb-2">
              Explore
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6">
                <p className="font-headline text-lg sm:text-xl md:text-2xl font-bold text-white">
                  {cat.name}
                </p>
                <p className="text-white/70 text-xs sm:text-sm mt-1 hidden sm:block">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/shop"
          className="sm:hidden flex items-center justify-center gap-2 mt-6 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
        >
          View All Categories <ArrowRight className="w-3 h-3" />
        </Link>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-secondary/20">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-tertiary mb-2">
              Curated Selection
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => {}}
            />
          ))}
        </div>
      </section>

      {/* ── Story / Craftsmanship Banner ─────────────────────── */}
      <section className="relative w-full py-20 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative aspect-4/5 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop"
              alt="Craftsmanship"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-5 md:gap-7">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-tertiary">
              Our Heritage
            </p>
            <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight">
              Stories Woven Across Generations
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Every MyBag piece carries the living legacy of Indonesian artisans.
              From the rattan weavers of Bali to the leather craftsmen of Jakarta,
              each creation honors techniques passed down through countless
              generations.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              We work directly with over 50 artisan communities, ensuring fair
              compensation while preserving traditional methods that make each piece
              uniquely remarkable.
            </p>
            <Link href="/craftsmanship" className="mt-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 px-6 tracking-widest text-xs font-semibold"
              >
                DISCOVER OUR CRAFT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-tertiary mb-2">
              Just Arrived
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => {}}
            />
          ))}
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24 bg-black">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/50 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3">
            Stay Connected
          </p>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Join the MyBag Archive
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
            Be the first to discover new arrivals, exclusive offers, and stories
            from our artisan communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-12 px-5 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 transition-colors text-sm"
            />
            <button className="h-12 px-8 bg-white text-black text-xs font-semibold tracking-widest rounded-full hover:bg-tertiary hover:text-white transition-colors">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}