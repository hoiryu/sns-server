import { SetMetadata } from '@nestjs/common';
import { ERoles } from '~users/consts/roles.const';

export const ROLES_KEY = 'user_roles';

// @Roles(RolesEnum.ADMIN)
export const Roles = (role: ERoles) => SetMetadata(ROLES_KEY, role);
