import DB from '@/utils/db';
import { __repository__Entity } from '@/entities/__repository__(lowerCase).entity';

export const __repository__Repository = DB.getRepository(__repository__Entity).extend({});
