"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles, Star, Truck } from "lucide-react";
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

const benefits = [
  {
    icon: Truck,
    title: "Free shipping",
    text: "On orders above Rp 700.000",
  },
  {
    icon: Sparkles,
    title: "Crafted uniquely",
    text: "Each detail hand-finished by artisans",
  },
  {
    icon: Star,
    title: "Loved by locals",
    text: "Rated 4.9 by our customers",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-[#fffaf7] text-[#1a1716]">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1800&h=1200&fit=crop"
            alt="MyBag editorial hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(226,114,91,0.28),transparent_30%),linear-gradient(90deg,rgba(17,15,14,0.82),rgba(17,15,14,0.42),rgba(17,15,14,0.22))]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 md:px-10 lg:px-16 lg:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-xl">
              <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.28em] text-white/90 uppercase backdrop-blur-sm">
                New collection 2026
              </span>
              <h1 className="font-headline text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                The everyday bag,
                <span className="mt-2 block text-[#f8d8cf]">made to be remembered.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base md:text-lg">
                Discover handcrafted Indonesian bags designed for elevated routines,
                thoughtful gifting, and statement moments that feel personal.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/shop" className="block">
                  <Button className="h-12 w-full rounded-full bg-[#f2b5a6] px-7 text-xs font-semibold tracking-[0.2em] text-[#1b1715] hover:bg-[#ef9f8d] sm:w-auto">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/best-seller" className="block">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-full border-white/40 bg-white/5 px-7 text-xs font-semibold tracking-[0.2em] text-white hover:bg-white/10 sm:w-auto"
                  >
                    Best Sellers
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs font-medium text-white/80">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#f0b7a6]" />
                  Handcrafted in Indonesia
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-[#f0b7a6]" />
                  4.9/5 customer rating
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-[0_35px_80px_rgba(0,0,0,0.32)] backdrop-blur-md">
                <div className="overflow-hidden rounded-[1.5rem] bg-[#f4e9e2]">
                  <div className="relative h-[420px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=900&fit=crop"
                      alt="Featured bag product"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="absolute -bottom-5 right-7 w-[80%] rounded-[1.5rem] border border-[#f2dacf] bg-white p-4 shadow-[0_30px_60px_rgba(86,66,58,0.18)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.22em] text-[#9a6d5d] uppercase">
                        Featured drop
                      </p>
                      <h3 className="mt-2 font-headline text-2xl font-bold text-[#1d1917]">
                        Aster Tote
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#f9eee8] px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-[#a2624d] uppercase">
                      Limited
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-[#7b6f6a] line-through">Rp 2.400.000</p>
                      <p className="text-xl font-bold text-[#1d1917]">Rp 1.980.000</p>
                    </div>
                    <Link href="/shop?category=tote" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#8a5b4b] uppercase">
                      Shop now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#f0e3dd] bg-[#fffdfc]">
        <div className="mx-auto grid w-full max-w-[1600px] gap-4 px-4 py-6 sm:px-6 md:grid-cols-3 md:px-10 lg:px-16">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3 rounded-[1.25rem] border border-[#f4e5df] bg-[#fffaf7] p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5e7e1] text-[#8a5d4e]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#221d1b]">{title}</p>
                <p className="mt-1 text-sm text-[#685d5a]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 md:px-10 lg:px-16 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-[#a76552] uppercase">Shop by style</p>
            <h2 className="mt-2 font-headline text-3xl font-bold text-[#1d1917] sm:text-4xl md:text-5xl">
              Find your signature carry
            </h2>
          </div>
          <Link href="/shop" className="hidden items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#6a5a54] uppercase transition-colors hover:text-[#1d1917] sm:inline-flex">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="group relative overflow-hidden rounded-[1.75rem]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <p className="font-headline text-xl font-bold text-white sm:text-2xl">{cat.name}</p>
                <p className="mt-1 text-xs text-white/75 uppercase tracking-[0.18em]">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f5e9e4]">
        <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:px-10 lg:px-16 lg:py-24">
          <div className="rounded-[2rem] bg-[#fffaf7] p-5 shadow-[0_25px_60px_rgba(72,54,49,0.08)] sm:p-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-[#a76552] uppercase">Curated edit</p>
                <h2 className="mt-2 font-headline text-3xl font-bold text-[#1d1917] sm:text-4xl">Our best sellers</h2>
              </div>
              <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#725c55] uppercase hover:text-[#1d1917]">
                Shop all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onClick={() => {}} />
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[2rem] border border-[#e8d5ce] bg-[#1d1917] p-6 text-white shadow-[0_30px_70px_rgba(29,25,23,0.25)] sm:p-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#f7c0aa] uppercase">Why people love us</p>
              <h3 className="mt-3 font-headline text-3xl font-bold leading-tight sm:text-4xl">
                Designed to move beautifully through your day.
              </h3>
            </div>

            <div className="mt-8 space-y-4">
              {[
                "Premium, durable materials selected for everyday wear.",
                "Ethically sourced and handcrafted by Indonesian artisans.",
                "Thoughtful details for work, travel, and gifting moments.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-full border border-white/10 bg-white/5 p-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#f3b4a0] text-[#1d1917]">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm leading-relaxed text-white/80">{item}</p>
                </div>
              ))}
            </div>

            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#f7c0aa] uppercase hover:text-white">
              Learn our story <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 md:px-10 lg:px-16 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-[#a76552] uppercase">Freshly dropped</p>
            <h2 className="mt-2 font-headline text-3xl font-bold text-[#1d1917] sm:text-4xl md:text-5xl">
              New arrivals
            </h2>
          </div>
          <Link href="/new-arrivals" className="hidden items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#6a5a54] uppercase transition-colors hover:text-[#1d1917] sm:inline-flex">
            Explore more <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => {}} />
          ))}
        </div>
      </section>

      <section className="bg-[#1c1716]">
        <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-16 sm:px-6 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-16 lg:py-20">
          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem]">
            <Image
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=1200&fit=crop"
              alt="Woman with bag"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#f7c0aa] uppercase">Limited release</p>
            <h2 className="mt-4 font-headline text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
              Thoughtful pieces for everyday luxury.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
              From workday essentials to special-occasion statement bags, our collections are designed to feel refined, useful, and distinctly personal.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="block">
                <Button className="h-12 w-full rounded-full bg-[#f6b5a1] px-8 text-xs font-semibold tracking-[0.2em] text-[#1c1716] hover:bg-[#f09d88] sm:w-auto">
                  Shop now
                </Button>
              </Link>
              <Link href="/craftsmanship" className="block">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full border-white/25 bg-white/5 px-8 text-xs font-semibold tracking-[0.2em] text-white hover:bg-white/10 sm:w-auto"
                >
                  Our craft
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf7] px-4 py-16 sm:px-6 md:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#a76552] uppercase">Stay in the loop</p>
          <h2 className="mt-3 font-headline text-3xl font-bold text-[#1d1917] sm:text-4xl md:text-5xl">
            Join the MyBag list
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#625b59]">
            Get first access to special drops, exclusive offers, and thoughtful style inspiration for your next favorite carry.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="your@email.com"
              className="h-12 min-w-0 flex-1 rounded-full border border-[#ead9d2] bg-white px-5 text-sm text-[#1d1917] placeholder:text-[#8b7f7b] focus:border-[#dfb6a5] focus:outline-none sm:max-w-md"
            />
            <button className="h-12 rounded-full bg-[#1d1917] px-7 text-xs font-semibold tracking-[0.2em] text-white transition-colors hover:bg-[#342d2b]">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
