"use client";

import { useEffect, useState } from "react";
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
import { Filter, staticFilterSections } from "@/components/ui/filter";
import { productsService, type ProductSort } from "@/services/products.service";
import { categoryService } from "@/services/category.service";
import type { CategoryItem, Product, ProductListResponse } from "@/interfaces";

const ITEMS_PER_PAGE = 12;

type BackendProductColor = {
  id?: number | string;
  name: string;
  hex_code?: string | null;
  stock?: number;
  product_color_images?: { image_url?: string }[];
};

type BackendProduct = {
  id: string;
  name: string;
  description: string;
  price: string | number | null;
  categories?: { name?: string } | null;
  badges?: { name?: string } | null;
  product_images?: { image_url?: string }[];
  product_colors?: BackendProductColor[];
};

const emptyProductListResponse: ProductListResponse = {
  items: [],
  meta: {
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  },
};

const normalizeProduct = (item: BackendProduct): Product => {
  const firstImage = item.product_images?.[0]?.image_url ?? "";
  const variantImages = (item.product_colors ?? []).map((color) => {
    const images = color.product_color_images ?? [];
    return {
      id: String(color.id ?? `${item.id}-${color.name}`),
      name: color.name,
      description: `${item.name} in ${color.name}`,
      price: Number(item.price ?? 0),
      color: color.name,
      colorHex: color.hex_code ?? "#000000",
      images: [
        images[0]?.image_url ?? firstImage,
        images[1]?.image_url ?? firstImage,
        images[2]?.image_url ?? firstImage,
      ] as [string, string, string],
    };
  });

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price ?? 0),
    image: firstImage,
    badge: item.badges?.name ?? undefined,
    category: item.categories?.name ?? "",
    variants: variantImages,
  };
};

export default function Shop() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedColor, setSelectedColor] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sort, setSort] = useState<ProductSort>("newest");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [productsData, setProductsData] = useState<ProductListResponse>(
    emptyProductListResponse,
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await categoryService.getCategories();
      if (!result.error && result.data) {
        setCategories(result.data);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const result = await productsService.getProductList({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        categoryId: selectedCategoryId,
        color: selectedColor || undefined,
        minPrice,
        maxPrice,
        search: searchTerm.trim() || undefined,
        sort,
      });

      if (result.error) {
        console.error("Failed to fetch products:", result.error.message);
        setProductsData(emptyProductListResponse);
        setIsLoading(false);
        return;
      }

      setProductsData(
        result.data ?? {
          ...emptyProductListResponse,
          meta: {
            ...emptyProductListResponse.meta,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          },
        },
      );
      setIsLoading(false);
    };

    fetchProducts();
  }, [
    currentPage,
    selectedCategoryId,
    selectedColor,
    minPrice,
    maxPrice,
    searchTerm,
    sort,
  ]);

  const sortByItems = [
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Best Sellers", value: "best_seller" },
  ];

  const categorySections = [
    {
      title: "Category",
      type: "category" as const,
      items: categories.map((c) => ({
        label: c.name,
        value: String(c.id),
        count: c._count?.products,
      })),
    },
    ...staticFilterSections,
  ];

  const products: Product[] = (productsData.items ?? []).map(normalizeProduct);

  const filteredProducts = products.filter((product) => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return true;

    return (
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword)
    );
  });

  const totalPages = Math.max(1, productsData.meta.totalPages ?? 1);
  const currentProducts = filteredProducts;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const router = useRouter();

  return (
    <BasePage>
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

      {/* Header Section - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6 lg:gap-0 lg:items-end mt-6 lg:mt-0">
        <div className="max-w-full lg:max-w-1/2">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl mb-2">
            The Bag Archive
          </h1>
          <p className="text-sm md:text-base text-gray-700 max-w-lg">
            A curated selection of hand-crafted vessels. From traditional
            Balinese weaving to contemporary Jakarta leatherwork, each piece
            tells a story of local mastery.
          </p>
        </div>

        {/* Controls - Search + Sort */}
        <div className="flex flex-col sm:flex-row lg:items-center gap-3 sm:gap-4 lg:justify-end w-full">
          <div className="relative w-full sm:max-w-sm lg:max-w-xs">
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
              className="w-full h-11 rounded-full border border-gray-200 bg-white/90 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase whitespace-nowrap hidden sm:inline">
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
              <SelectTrigger className="w-full sm:w-auto sm:min-w-40 lg:w-48 bg-white/90 border-gray-200 shadow-sm">
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
          <Filter
            sections={categorySections}
            selectedCategory={selectedCategoryId ? String(selectedCategoryId) : undefined}
            onCategoryChange={(value) => {
              setSelectedCategoryId(value ? Number(value) : undefined);
              setCurrentPage(1);
            }}
          />
        }
        className="mt-8"
      >
        {isLoading ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
            <p className="text-sm text-gray-600">Loading products...</p>
          </div>
        ) : currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {currentProducts.map((product) => (
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
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
            <p className="text-sm text-gray-600">
              No products found for &quot;{searchTerm}&quot;.
            </p>
          </div>
        )}

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
