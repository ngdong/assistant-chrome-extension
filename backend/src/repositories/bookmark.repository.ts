import DB from '@/utils/db';
import { BookmarkEntity } from '@/entities/bookmark.entity';

export const BookmarkRepository = DB.getRepository(BookmarkEntity).extend({});
