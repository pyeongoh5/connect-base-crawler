export const HEADER_SIZE = 36;

export interface Category {
  id: string;
  list: SubCategoryItem[];
}

export interface SubCategoryItem { label: string, link: string }