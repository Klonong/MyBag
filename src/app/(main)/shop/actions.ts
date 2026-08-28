"use server";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "");

export type CategoryItem = {
  id: number;
  name: string;
};

export async function getCategories(): Promise<CategoryItem[]> {
  const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}
