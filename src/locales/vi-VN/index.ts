import { viVN_account } from './account';
import { viVN_avatorDropMenu } from './user/avatorDropMenu';
import { viVN_tagsViewDropMenu } from './user/tagsViewDropMenu';
import { viVN_title } from './user/title';
import { viVN_globalTips } from './global/tips';
import { viVN_permissionRole } from './permission/role';
import { viVN_dashboard } from './dashboard';
import { viVN_guide } from './guide';
import { viVN_documentation } from './documentation';
import { viVN_product } from './product';
import { viVN_coin } from './coin';
import { viVN_category } from './category';
import { viVN_company } from './company';
import { viVN_content } from './content';
import { viVN_event } from './event';
import { viVN_person } from './person';
import { viVN_country } from './country';
import { viVN_fund } from './fund';

const vi_VN = {
  ...viVN_account,
  ...viVN_avatorDropMenu,
  ...viVN_tagsViewDropMenu,
  ...viVN_title,
  ...viVN_globalTips,
  ...viVN_permissionRole,
  ...viVN_dashboard,
  ...viVN_guide,
  ...viVN_documentation,
  ...viVN_product,
  ...viVN_coin,
  ...viVN_category,
  ...viVN_content,
  ...viVN_company,
  ...viVN_event,
  ...viVN_person,
  ...viVN_country,
  ...viVN_fund,
};

export default vi_VN;
