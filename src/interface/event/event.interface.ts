interface Agendar {
  time: Date;
  description: string;
}
interface ObjectId {
  id: string;
}

export interface Event {
  id: string;
  type: string;
  trending: boolean;
  significant: boolean;
  name: string;
  introduction: string;
  email: string;
  agendas: Array<Agendar>;
  location: any;
  start_date: Date;
  end_date: Date;
  categories: Array<ObjectId>;
  country: string;
  speakers: Array<string>;
  sponsors: Array<string>;
  subscribers: Array<string>;
  banners: Array<string>;
  media: Array<string>;
  deleted: boolean;
  created_at?: Date;
  updated_at?: Date;
  tel?: string;
  website: string;
  created_by: string;
}

export type GetEventResult = { total_count: number; items: Event[] };
