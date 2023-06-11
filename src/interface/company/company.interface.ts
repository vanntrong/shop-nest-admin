import { Translation } from '@/types/common';

interface Service {
  title: string;
  description: string;
}

interface Support {
  name: string;
  url: string;
}

interface TeamPersonContact {
  name: string;
  url: string;
}
interface TeamPerson {
  name: string;
  position: string;
  contacts: Array<TeamPersonContact>;
}

interface ResearchPaper {
  title: string;
  url: string;
}

export interface Company {
  id: string;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  name: string;
  verified: boolean;
  about: string;
  video?: string;
  founders: Array<any>;
  headquarter: string;
  avatar: string;
  website: string;
  telegram: string;
  linkedin: string;
  twitter: string;
  discord: string;
  gitter: string;
  medium: string;
  bitcoin_talk: string;
  facebook: string;
  youtube: string;
  blog: string;
  github: string;
  reddit: string;
  explorer: string;
  stack_exchange: string;
  whitepaper: string;
  short_description: string;
  location: string;
  services?: Array<Service>;
  supports?: Array<Support>;
  categories?: Array<string>;
  products?: Array<string>;
  research_papers?: Array<ResearchPaper>;
  team?: Array<TeamPerson>;
  crypto_currencies?: Array<any>;
  clients?: Array<string>;
  portfolios?: Array<string>;
  galleries?: Array<string>;
  trans: Translation[];
}

export type GetCompanyResult = { total_count: number; items: Company[] };
