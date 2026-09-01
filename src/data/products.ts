import type { Product } from "@/interfaces";

const BASE = "https://images.unsplash.com/photo-";
const toImg = (id: string) => `${BASE}${id}?w=500&h=500&fit=crop`;

type ImageSet = [string, string, string];

// Four confirmed bag photos used as the image pool
const POOL: [string, string, string, string] = [
  toImg("1548036328-c9fa89d128fa"),
  toImg("1594938298603-c8148c4dae35"),
  toImg("1553062407-98eeb64c6a62"),
  toImg("1584917865442-de89df76afd3"),
];

/** Returns 3 images starting at `offset`, wrapping around the pool. */
const imgSet = (offset: number): ImageSet => [
  POOL[offset % 4],
  POOL[(offset + 1) % 4],
  POOL[(offset + 2) % 4],
];

const colorHex: Record<string, string> = {
  Camel: "#C19A6B",
  Black: "#1a1a1a",
  Ivory: "#F5F5DC",
  Burgundy: "#722F37",
  Taupe: "#8B7355",
  Natural: "#D4B896",
  DarkBrown: "#3D2314",
  Olive: "#6B7C45",
  BlueBatik: "#1B4F8A",
  RedBatik: "#8B1A2E",
  Brown: "#7B4F2E",
  Espresso: "#3E1F0E",
  Sand: "#C2B280",
};

const createVariants = (
  productId: string,
  productName: string,
  basePrice: number,
  baseImageOffset: number,
  colors: string[],
) =>
  colors.map((color, index) => ({
    id: `${productId}${String.fromCharCode(97 + index)}`,
    name: `${productName} - ${color}`,
    description: `${productName} in ${color}`,
    price: basePrice + index * 50000,
    color,
    colorHex: colorHex[color] ?? "#888888",
    images: imgSet(baseImageOffset + index),
  }));

export const products: Product[] = [
  {
    id: "1",
    name: "Karsa Grain Tote",
    description: "Hand-milled Indonesian Cowhide",
    price: 3450000,
    image: toImg("1548036328-c9fa89d128fa"),
    badge: "LIMITED",
    category: "tote",
    material: ["leather"],
    variants: createVariants("1", "Karsa Grain Tote", 3450000, 0, [
      "Camel",
      "Black",
      "Ivory",
      "Burgundy",
      "Taupe",
    ]),
  },
  {
    id: "2",
    name: "Sumba Weave Shell",
    description: "Natural Rattan & Brass Hardware",
    price: 1850000,
    image: toImg("1584917865442-de89df76afd3"),
    category: "crossbody",
    material: ["rattan"],
    variants: createVariants("2", "Sumba Weave Shell", 1850000, 1, [
      "Natural",
      "DarkBrown",
    ]),
  },
  {
    id: "3",
    name: "Tempo Canvas Duffle",
    description: "24oz Waxed Canvas & Leather",
    price: 2950000,
    image: toImg("1594938298603-c8148c4dae35"),
    category: "shoulder",
    material: ["canvas", "leather"],
    variants: createVariants("", "Tempo Canvas Duffle", 2950000, 2, [
      "Olive",
      "Black",
      "Natural",
      "Dark Brown",
      "Espresso",
      "Sand"
    ]),
  },
  {
    id: "4",
    name: "Bali Crossbody Compact",
    description: "Handwoven Batik Fabric",
    price: 1200000,
    image: toImg("1584917865442-de89df76afd3"),
    category: "crossbody",
    material: ["batik"],
    variants: createVariants("4", "Bali Crossbody Compact", 1200000, 1, [
      "Blue Batik",
      "Red Batik",
    ]),
  },
  {
    id: "5",
    name: "Jakarta Leather Backpack",
    description: "Premium Vegetable Tanned Leather",
    price: 4200000,
    image: toImg("1553062407-98eeb64c6a62"),
    badge: "BESTSELLER",
    category: "backpacks",
    material: ["leather"],
    variants: createVariants("5", "Jakarta Leather Backpack", 4200000, 3, [
      "Brown",
      "Black",
    ]),
  },
  {
    id: "6",
    name: "Lombok Rattan Clutch",
    description: "Traditional Woven Rattan",
    price: 850000,
    image: toImg("1548036328-c9fa89d128fa"),
    category: "clutches",
    material: ["rattan"],
    variants: createVariants("6", "Lombok Rattan Clutch", 850000, 0, [
      "Natural",
      "Espresso",
    ]),
  },
  {
    id: "7",
    name: "Yogya Canvas Sling",
    description: "Organic Cotton Canvas & Jute",
    price: 950000,
    image: toImg("1584917865442-de89df76afd3"),
    category: "crossbody",
    material: ["canvas", "jute"],
    variants: createVariants("7", "Yogya Canvas Sling", 950000, 1, [
      "Sand",
      "Olive",
      "Black",
    ]),
  },
  {
    id: "8",
    name: "Banyuwangi Weekend Bag",
    description: "Mixed Leather & Canvas",
    price: 2100000,
    image: toImg("1594938298603-c8148c4dae35"),
    category: "shoulder",
    material: ["leather", "canvas"],
    variants: createVariants("8", "Banyuwangi Weekend Bag", 2100000, 2, [
      "Olive",
      "Black",
    ]),
  },
  {
    id: "9",
    name: "Ubud Small Tote",
    description: "Compact Leather with Gold Hardware",
    price: 1650000,
    image: toImg("1548036328-c9fa89d128fa"),
    category: "tote",
    material: ["leather"],
    variants: createVariants("9", "Ubud Small Tote", 1650000, 0, [
      "Camel",
      "Black",
    ]),
  },
];
