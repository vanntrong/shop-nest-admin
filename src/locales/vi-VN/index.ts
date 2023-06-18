import { viVN_avatorDropMenu } from './user/avatorDropMenu';
import { viVN_tagsViewDropMenu } from './user/tagsViewDropMenu';
import { viVN_title } from './user/title';
import { viVN_globalTips } from './global/tips';
import { viVN_dashboard } from './dashboard';
import { viVN_documentation } from './documentation';
import { viVN_product } from './product';
import { viVN_category } from './category';
import { viVN_person } from './person';
import { viVN_promotion } from './promotion';

const vi_VN = {
  ...viVN_avatorDropMenu,
  ...viVN_tagsViewDropMenu,
  ...viVN_title,
  ...viVN_globalTips,
  ...viVN_dashboard,
  ...viVN_documentation,
  ...viVN_product,
  ...viVN_category,
  ...viVN_person,
  ...viVN_promotion,
};

export default vi_VN;
