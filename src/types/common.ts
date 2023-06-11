export interface PAGINATION_PARAMS {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: string;
}

export interface Pagination<T> {
  items: Array<T>;
  total_count: number;
}
export interface PARAMS {
  id: string;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type Translation = {
  lang: string;
  [key: string]: any;
};

export type TablePagination = { current: number; total: number; pageSize: number };
