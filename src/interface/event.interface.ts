import { Translation } from '@/types/common';

export enum EventType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  VIRTUAL = 'virtual',
}
export interface ObjectId {
  name: string;
  avatar: string;
  id: string;
}

export type Agenda = {
  time: Date;
  description: string;
  trans?: Array<Translation>;
};
export interface Event {
  id: string;
  name?: string;
  introduction?: string;
  start_date: Date;
  end_date: Date;
  tel?: string;
  email?: string;
  website?: string;
  type?: EventType | any;
  categories?: Array<any>;
  speakers?: Array<ObjectId>;
  sponsors?: Array<any>;
  country?: string;
  subscribers?: Array<any>;
  banners?: Array<string>;
  media?: Array<any>;
  deleted?: boolean;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  agendas?: Array<Agenda>;
  trans: Array<Translation>;
}
export type GetEventResult = { total_count: number; items: Event[] };
