import { RoleType } from '../config/roles';
import { USER_TYPES } from '../utils/constants';

export interface LoginType {
  _id: string;
  type: keyof typeof USER_TYPES;
  userName: string;
  password: string;
  roles: Array<RoleType>;
}
