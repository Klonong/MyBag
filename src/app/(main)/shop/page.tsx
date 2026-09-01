"use client";

import { BasePage, LeftAsideLayout } from "@/components/base";
import { ProductCard } from "@/components/ui/product-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter } from "@/components/ui/filter";
import { useShopProducts } from "@/hooks/useShopProducts";
import { ProductSort } from "@/services/products.service";

export default function Shop() {
  const {
    currentPage,
    searchTerm,
    setSearchTerm,
    selectedCategoryId,
    setSelectedCategoryId,
    sort,
    setSort,
    filteredProducts,
    isLoading,
    totalPages,
    sortByItems,
    categorySections,
    handlePageChange,
    setCurrentPage
  } = useShopProducts();

  const router = useRouter();

  return (
    <BasePage>
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shop</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <section className="relative overflow-hidden rounded-[2rem] border border-[#f2e4df] bg-gradient-to-r from-[#fffaf8] via-[#fff6f2] to-[#f4ede8] p-5 shadow-[0_20px_60px_rgba(120,88,74,0.08)] sm:p-8 lg:p-10">
        <div className="absolute -right-16 top-6 h-44 w-44 rounded-full bg-[#f0d9d0]/70 blur-3xl" />
        <div className="absolute left-10 top-10 h-28 w-28 rounded-full bg-[#e9c2b3]/40 blur-2xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full border border-[#eed5cb] bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b86650]">
              Curated archive
            </span>
            <h1 className="font-headline text-4xl font-bold leading-none text-[#1e1a18] sm:text-5xl lg:text-6xl">
              The Bag Archive
            </h1>
            <p className="max-w-xl text-sm leading-7 text-[#544d49] sm:text-base">
              Discover hand-finished silhouettes made for everyday rituals, thoughtful gifting, and elevated travel. Each piece is designed to move beautifully with your life.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/80 bg-white/75 p-4 backdrop-blur-sm shadow-[0_16px_36px_rgba(83,68,60,0.08)]">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl bg-[#f8efe9] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9f7b68]">Craft</p>
                <p className="mt-2 font-headline text-2xl font-bold text-[#1d1a18]">Handmade</p>
              </div>
              <div className="rounded-2xl bg-[#f7f1ee] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9f7b68]">Origin</p>
                <p className="mt-2 font-headline text-2xl font-bold text-[#1d1a18]">Bali</p>
              </div>
              <div className="rounded-2xl bg-[#f5eae4] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9f7b68]">Edition</p>
                <p className="mt-2 font-headline text-2xl font-bold text-[#1d1a18]">Limited</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls - Search + Sort */}
      <div className="mt-8 rounded-[1.5rem] border border-[#f1e5e0] bg-white/80 p-3 shadow-[0_10px_30px_rgba(90,77,68,0.05)] backdrop-blur-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:flex-1">
            <Label htmlFor="product-search" className="sr-only">
              Search products
            </Label>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="product-search"
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search products"
              className="h-11 w-full rounded-full border border-[#eee3df] bg-[#fffdfc] pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-all focus:border-[#d7a995] focus:ring-2 focus:ring-[#f2ddd5]"
            />
          </div>

          <div className="flex items-center gap-3 lg:ml-auto lg:justify-end">
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a706d] sm:inline">
              Sort By
            </span>
            <Select
              items={sortByItems}
              value={sort}
              onValueChange={(value) => {
                setSort(value as ProductSort);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:min-w-40 lg:w-48 rounded-full border border-[#eee3df] bg-[#fffdfc] shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort By</SelectLabel>
                  {sortByItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <LeftAsideLayout
        aside={
          <div className="rounded-[1.5rem] border border-[#f1e5e0] bg-[#fffdfc] p-4 shadow-[0_10px_25px_rgba(93,79,72,0.04)]">
            <Filter
              sections={categorySections}
              selectedCategory={selectedCategoryId ? String(selectedCategoryId) : undefined}
              onCategoryChange={(value) => {
                setSelectedCategoryId(value ? Number(value) : undefined);
                setCurrentPage(1);
              }}
            />
          </div>
        }
        className="mt-8"
      >
        <div className="rounded-[1.75rem] border border-[#f5e9e5] bg-[#fffdfc] p-3 shadow-[0_12px_35px_rgba(88,76,68,0.03)] sm:p-5">
          {isLoading ? (
            <div className="rounded-[1.25rem] border border-[#f2e8e3] bg-[#fff8f5] px-6 py-14 text-center">
              <p className="text-sm text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => {
                    console.log(
                      `Navigating to product detail page for product ID: ${product.id}`,
                    );
                    router.push(`/shop/${product.id}`);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-[#ead7cf] bg-[#fff8f5] px-6 py-14 text-center">
              <p className="text-sm text-gray-600">
                No products found for &quot;{searchTerm}&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && filteredProducts.length > 0 && totalPages > 1 && (
          <div className="mt-10 md:mt-12 flex justify-center">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return <PaginationEllipsis key={page} />;
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </LeftAsideLayout>
    </BasePage>
  );
}
