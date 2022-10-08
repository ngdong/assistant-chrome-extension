import DB from '@/utils/db';
import { BookmarkEntity } from '@/entities/bookmark.entity';

export const BookmarkRepository = DB.getRepository(BookmarkEntity).extend({
  updateOrder(bookmarkId: number, order: number) {
    return this.createQueryBuilder('bookmark')
      .update({
        order,
      })
      .where({
        id: Number(bookmarkId),
      })
      .returning('*')
      .execute();
  },
});
