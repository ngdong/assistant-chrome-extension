import DB from '@/utils/db';
import { UserEntity } from '@/entities/user.entity';

export const UserRepository = DB.getRepository(UserEntity).extend({});
