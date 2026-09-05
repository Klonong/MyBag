import { useEffect, useState } from "react";
import type { Product, ProductDetail, ProductVariant } from "@/interfaces";
import { productsService } from "@/services/products.service";

export const normalizeProductDetail = (item: ProductDetail): Product => {
  const firstImage = item.product_images?.[0]?.image_url ?? "";
  const variantImages = (item.product_colors ?? []).map((color) => ({
    id: String(color.id ?? `${item.id}-${color.name}`),
    name: color.name,
    description: `${item.name} in ${color.name}`,
    price: Number(item.price ?? 0),
    color: color.name,
    colorHex: color.hex_code ?? "#000000",
    images: [
      color.product_color_images?.[0]?.image_url ?? firstImage,
      color.product_color_images?.[1]?.image_url ?? firstImage,
      color.product_color_images?.[2]?.image_url ?? firstImage,
    ] as [string, string, string],
  }));

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price ?? 0),
    image: firstImage,
    badge: item.badges?.name ?? undefined,
    category: item.categories?.name ?? "Uncategorized",
    variants: variantImages,
    rating: item.rating,
  };
};

export const useProductDetail = (productId?: string | string[] | null) => {
  const normalizedId = Array.isArray(productId)
    ? productId[0]
    : productId ?? null;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      if (!normalizedId) {
        if (!active) return;
        setProduct(null);
        setSelectedVariantId(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const result = await productsService.getProductById(normalizedId);
      if (!active) return;

      if (result.error) {
        console.error("Failed to fetch product:", result.error.message);
        setProduct(null);
        setSelectedVariantId(null);
        setIsLoading(false);
        return;
      }

      if (!result.data) {
        setProduct(null);
        setSelectedVariantId(null);
        setIsLoading(false);
        return;
      }

      const mappedProduct = normalizeProductDetail(result.data);
      setProduct(mappedProduct);
      setSelectedVariantId(mappedProduct.variants?.[0]?.id ?? null);
      setSelectedImageIdx(0);
      setIsLoading(false);
    };

    void fetchProduct();

    return () => {
      active = false;
    };
  }, [normalizedId]);

  const selectedVariant =
    product?.variants?.find((variant) => variant.id === selectedVariantId) ??
    product?.variants?.[0] ??
    null;

  const currentImages: string[] = selectedVariant?.images ?? [
    product?.image ?? "",
    product?.image ?? "",
    product?.image ?? "",
  ];

  const mainImage =
    currentImages[selectedImageIdx] ?? currentImages[0] ?? product?.image ?? "";

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariantId(variant.id);
    setSelectedImageIdx(0);
  };

  return {
    product,
    selectedVariant,
    currentImages,
    mainImage,
    selectedImageIdx,
    setSelectedImageIdx,
    isLoading,
    handleVariantSelect,
  };
};
