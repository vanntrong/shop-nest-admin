/** user's role */
export type Role = 'guest' | 'admin';

export interface LoginParams {
  /** 用户名 */
  username: string;
  /** 用户密码 */
  password: string;
}

export interface LoginResult {
  /** auth token */
  tokens?: {
    access_token?: string;
    refresh_token?: string;
    expires_in?: string;
    refresh_expires_in?: string;
  };
  user?: {
    full_name: string;
    email: string;
    phone: string;
    picture: string;
    roles: Array<Role>;
  };
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult {}
