export interface Fund {
  id: string;
  name: string;
  about: string;
  avatar?: Array<string>;
  posts?: Array<string>;
  cryptocurrencies?: Array<any>;
  total_amount?: number;
  fundraising_rounds?: Array<RoundFund>;
  partners?: Array<PartnerFund>;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted?: boolean;
  reviewed?: boolean;
  need_review?: boolean;
  trans: any;
  firms?: Array<FirmFund>;
  investments?: Array<InvestmentFund>;
  categories?: Array<object>;
  type?: FUND_TYPE;
}

export interface RoundFund {
  round_id: string;
  round_name: string;
  stage: string;
  amount: number;
}

export interface PartnerFund {
  name: string;
  foreign_id: string;
}

export interface FirmFund {
  name: string;
  foreign_id: string;
}

export interface InvestmentFund {
  name: string;
  foreign_id: string;
  type: string;
}

export enum FUND_TYPE {
  NA = 'N/A',
  CRYPTO_VENTURE = 'Crypto Venture',
  EXCHANGE_FUND = 'Exchange Fund',
  DEVELOPER_SUPPORT = 'Developer Support',
  MARKETING_SUPPORT = 'Marketing Support',
  SECURITY_SUPPORT = 'Security Support',
  PROJECT_BASED = 'Project Based',
  NON_CRYPTO_CAPITAL = 'Non-Crypto Capital',
}
