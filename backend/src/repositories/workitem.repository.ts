import DB from '@/utils/db';
import { WorkitemEntity } from '@/entities/workitem.entity';

export const WorkitemRepository = DB.getRepository(WorkitemEntity).extend({});
