import { App, ContractAddress, ProductInfo, Support, TeamPerson } from '@/interface';

export interface Product {
  slug: string;
  id: string;
  name: string;
  thumbnailUrl: string;
  verified: boolean;
  sponsored: boolean;
  about: string;
  contract_addresses?: Array<ContractAddress>;
  crypto_currencies?: string[];
  categories?: Array<object>;
  features?: string[];
  apps: App[];
  supports: Support[];
  images: string[];
  informations: ProductInfo[];
  team: TeamPerson[];
  parent_company: string;
  team_location: string;
  salePrice?: number;
  saleEndAt?: string;
}

export type GetProductResult = { total_count: number; items: Product[] };
