import { Category } from '../category/category.interface';
import { Coin } from '../coin/coin.interface';
import { Company } from '../company/company.interface';
import { Product } from '../product/product.interface';

export interface Content {
  id?: string;
  author?: {
    id: string;
    full_name: string;
    avatar?: string;
  };
  coin_tags?: Array<Coin>;
  company_tags?: Array<Company>;
  content: string;
  deleted?: boolean;
  headings?: Array<string>;
  keywords?: Array<string>;
  number_relate_article?: number;
  photos?: Array<string>;
  product_tags?: Array<Product>;
  slug?: string;
  source?: string;
  starts?: number;
  summary?: string;
  title: string;
  views?: number;
  created_at?: Date;
  updated_at?: Date;
  categories?: Array<Category>;
  country?: string;
  person_tags?: Array<any>;
  event_tags?: Array<any>;
  status?: ContentStatus;
  languageCode?: string;
}

export enum ContentStatus {
  PROCESSING = 'processing',
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

export type GetContentResult = { total_count: number; items: Content[] };

export type ContentDraftParams = {
  page?: number;
  perPage?: number;
  status?: ContentStatus;
  q?: string;
};

export interface DraftContent {
  title: string;
  status: ContentStatus;
  id: string;
  createdAt: Date;
  // updated_at: Date;
  languageCode: string;
  author: {
    id: string;
    name: string;
    status: string;
  };
}
