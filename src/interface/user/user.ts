import { Device } from '@/interface/layout/index.interface';
import { MenuChild } from '@/interface/layout/menu.interface';
import { Role } from './login';

export type Locale = 'vi_VN' | 'en_US';

export interface User {
  dob: string;
  email: string;
  full_name: string;
  gender: string;
  id: string;
  phone: string;
  roles: Array<string>;
  updated_at: Date;
  _full_name_alias: Array<string>;
  picture?: string;
}

export interface UserState {
  username: string;

  /** menu list for init tagsView */
  menuList: MenuChild[];

  /** login status */
  logged: boolean;

  role: Role;

  /** user's device */
  device: Device;

  /** menu collapsed status */
  collapsed: boolean;

  /** notification count */
  noticeCount: number;

  /** user's language */
  locale: Locale;

  /** Is first time to view the site ? */
  newUser: boolean;

  accessToken: string;
  refreshToken: string;

  user: User | null;

  exp: number;
}
