import { App, ContractAddress, ProductInfo, Support, TeamPerson } from '@/interface';
import { Translation } from '@/types/common';

export interface Product {
  slug: string;
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  sponsored: boolean;
  about: string;
  contract_addresses?: Array<ContractAddress>;
  crypto_currencies?: string[];
  categories?: Array<object>;
  features?: string[];
  apps: App[];
  supports: Support[];
  galleries: string[];
  informations: ProductInfo[];
  team: TeamPerson[];
  parent_company: string;
  team_location: string;
  website: string;
  facebook: string;
  telegram: string;
  twitter: string;
  youtube: string;
  discord: string;
  medium: string;
  reddit: string;
  blog: string;
  rocket_chat: string;
  trans: Array<Translation>;
}

export type GetProductResult = { total_count: number; items: Product[] };
