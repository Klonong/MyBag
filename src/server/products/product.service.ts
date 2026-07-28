import { prisma } from "@/server/db/prisma";

export type AdminSelectItem = {
  id: number;
  name: string;
};

export type CategoryItem = {
  id: number;
  name: string;
};

export type ColorInput = {
  name: string;
  hexCode: string;
  stock: number;
  imageUrls: string[];
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  discount?: number;
  categoryId: number;
  badgeId: number;
  productImageUrls: string[];
  colors: ColorInput[];
};

export async function getCategories(): Promise<CategoryItem[]> {
  const rows = await prisma.category.findMany({
    orderBy: { category_name: "asc" },
  });

  return rows.map((c) => ({
    id: Number(c.category_id),
    name: c.category_name,
  }));
}

export async function getAdminFormData(): Promise<{
  categories: AdminSelectItem[];
  badges: AdminSelectItem[];
}> {
  const [categories, badges] = await Promise.all([
    prisma.category.findMany({ orderBy: { category_name: "asc" } }),
    prisma.badge.findMany({ orderBy: { badge_name: "asc" } }),
  ]);

  return {
    categories: categories.map((c) => ({
      id: Number(c.category_id),
      name: c.category_name,
    })),
    badges: badges.map((b) => ({
      id: Number(b.badge_id),
      name: b.badge_name,
    })),
  };
}

export async function createProductRecord(
  input: CreateProductInput
): Promise<void> {
  const {
    name,
    description,
    price,
    discount,
    categoryId,
    badgeId,
    productImageUrls,
    colors,
  } = input;

  await prisma.products.create({
    data: {
      name,
      description,
      price,
      discount: discount ?? null,
      category_id: categoryId,
      badge_id: badgeId,
      product_images: {
        create: productImageUrls.map((url) => ({ image_url: url })),
      },
      product_colors: {
        create: colors.map((color) => ({
          name: color.name,
          hex_code: color.hexCode,
          stock: color.stock,
          product_color_images: {
            create: color.imageUrls.map((url) => ({ image_url: url })),
          },
        })),
      },
    },
  });
}
