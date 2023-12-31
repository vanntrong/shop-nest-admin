import { CATEGORY_TYPE } from '..';

export interface Category {
  id: string;
  title: string;
  name: string;
  type: CATEGORY_TYPE;
  acronym: string;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by: string;
  weight: number;
  subCategories: Category[];
  slug: string;
}

export type GetCategoryResult = { total_count: number; items: Category[] };
