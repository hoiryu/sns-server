import { PickType } from '@nestjs/swagger';
import { UserProfilesModel } from '~users/user-profiles/entity/user-profiles.entity';

export class CreateUserProfilesDto extends PickType(UserProfilesModel, ['user']) {}
