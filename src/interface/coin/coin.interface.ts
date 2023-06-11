import { DEVELOPMENT_STATUS, TeamPerson } from '@/interface';
import { Translation } from '@/types/common';

interface Ico {
  start_date: string;
  end_date: string;
  soft_cap: string;
  hard_cap: string;
  total_supply: string;
  investor_supply: string;
  market_cap_at: string;
  conversion: string;
}

interface Technology {
  blockchain?: string;
  consensus?: string;
  hash_algorithm?: string;
  org_structure?: string;
  open_source?: string;
  development_status?: string;
  hardware_wallet?: string;
}
interface Blockchain {
  id: string;
  avatar: string;
  slug: string;
  categories: Array<string>;
  about: string;
  name: string;
}
// interface MarketData {
// open?: number;
// high?: number;
// low?: number;
// close?: number;
// voluem?: number;

// }

export interface Coin {
  id: string;
  name: string;
  token_id: string;
  about: string;
  video: string;
  avatar: string;
  blog: string;
  facebook: string;
  youtube: string;
  reddit: string;
  explorer: string;
  stack_exchange: string;
  website: string;
  telegram: string;
  whitepaper: string;
  twitter: string;
  discord: string;
  bitcoin_talk: string;
  gitter: string;
  medium: string;
  categories?: Array<object>;
  blockchains?: Array<string>;
  services?: Array<string>;
  features?: Array<string>;
  technologies?: Technology;
  exchanges?: Array<string>;
  wallets?: Array<string>;
  team?: Array<TeamPerson>;
  companies?: Array<string>;
  ico?: Ico;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  potential?: string;
  reliability?: string;
  rating?: string;
  year?: string;
  market?: string;
  market_share?: number;
  dapp?: string;
  founded?: string;
  development_status?: DEVELOPMENT_STATUS;
  stage?: string;
  eco_market_cap?: number;
  backer?: string;
  fundraising?: string;
  // market_data?: MarketData;
  trans: Translation[];
}

export type GetCoinResult = { total_count: number; items: Coin[] };
export type GetBlockchainResul = { total_count: number; items: Blockchain[] };
