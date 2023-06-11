export interface Country {
  id: string;
  name: string;
  code: string;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
export type GetCountryResult = { total_count: number; items: Country[] };
