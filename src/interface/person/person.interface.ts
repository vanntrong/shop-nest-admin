import { Translation } from '@/types/common';

interface Work {
  company: string;
  position: string;
  type: string;
}
interface ObjectId {
  title: string;
  type: string;
  id: string;
}

export interface Person {
  id: string;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  name: string;
  verified: boolean;
  about: string;
  avatar: string;
  short_description: string;
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
  categories: Array<ObjectId>;
  educations: Array<string>;
  works: Array<Work>;
  trans: Translation[];
}
export type GetPersonResult = { total_count: number; items: Person[] };
