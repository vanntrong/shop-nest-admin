export interface Locales<T = any> {
  /** Chinese */
  zh_CN: T;
  /** English */
  en_US: T;
}

export type Language = keyof Locales;

export interface PageData<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}

export interface RequestParams {
  offset?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'DESC' | 'ASC';
  keyword?: string;
  lang?: string;
  type?: string;
}

export interface ContractAddress {
  owner: string;
  address?: string;
  url?: string;
}

export interface App {
  name: string;
  url: string;
}

export interface TeamPerson {
  name: string;
  position: string;
  contacts?: Array<{
    name: string;
    url: string;
  }>;
}

export interface Support {
  name: string;
  url: string;
}

export interface ProductInfo {
  'Parent Company'?: string;
  'Team Location'?: string;
  Blockchain?: string;
  Token?: string;
  Release?: string;
  'Software License'?: string;
}
export enum DEVELOPMENT_STATUS {
  WORKING_PRODUCT = 'working_product',
  ON_GOING_DEVELOPMENT = 'on_going_development',
  ALPHA_VERSION = 'alpha_version',
  BETA_VERSION = 'beta_version',
  DEFUNCT = 'defunct',
  UNKNOWN = 'unknown',
  PROTOTYPE_MVP = 'prototype_mvp',
}

export enum CATEGORY_TYPE {
  // LISTENING = 'listening',
  // WIKIBLOCK = 'wikiblock',
  // EVENT = 'event',
  // NEWS = 'news',
  // RELATED_NEWS = 'related_news',
  // BLOCKCHAIN = 'blockchain',
  // APPLICATION = 'application',
  // CONSENSUS = 'consensus',
  // CRYPTO_ASSET = 'crypto_asset',
  // PERSON = 'person',
  // PRODUCT = 'product',
  // COMPANY = 'company',
  // CRYPTO = 'crypto',
  // EXPLORATION = 'exploration',
  // SUB_EXPLORATION = 'sub_exploration',
  // INVESTOR = 'investor',
  COMPANY = 'company',
  CRYPTO_ASSET = 'crypto_asset',
  NEWS = 'news',
  CRYPTO_SECTOR = 'crypto_sector',
  EXPLORATION = 'exploration',
  BLOCKCHAIN = 'blockchain',
  APPLICATION = 'application',
  PERSON = 'person',
  PRODUCT = 'product',
  EVENT = 'event',
  CONSENSUS = 'consensus',
  INVESTOR = 'investor',
}
