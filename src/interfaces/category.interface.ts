export interface CategoryItem {
  id: number;
  name: string;
  _count?: {
    products?: number;
  };
}
