import BookmarkRepository from '../repositories/BookmarkRepository.ts';
import type { IBookmarkInput } from '../entities/IBookmark.ts';

export default class BookmarkService {
  readonly bookmarkRepository = new BookmarkRepository();

  constructor() {}

  async getAll() {
    return await this.bookmarkRepository.find();
  }

  async getAllChildren(parentId: string) {
    return await this.bookmarkRepository.findByParentId(parentId);
  }

  async createBookmark(bookmark: IBookmarkInput) {
    const { parent_id } = bookmark;
    const count = await this.bookmarkRepository.countByParentId(parent_id);
    bookmark.order = count;
    try {
      const bookmarkId = await this.bookmarkRepository.insertOne(bookmark);
      console.log(bookmarkId);
      const result = await this.bookmarkRepository.findOneById(bookmarkId);
      return result;
    } catch (error) {
      console.log('Error');
      throw new Error('Failed to bookmark');
    }
  }

  async createManyBookmark(users: IBookmarkInput[]) {
    const { parent_id } = users[0];
    const count = await this.bookmarkRepository.countByParentId(parent_id);
    const listBookmark = users.map((item, index) => {
      item.order = count + index;
      return item;
    });
    return await this.bookmarkRepository.insertMany(listBookmark);
  }

  async updateBookmark(bookmarkId: string, bookmark: IBookmarkInput) {
    return await this.bookmarkRepository.updateOne(bookmarkId, bookmark);
  }

  async deleteBookmark(bookmarkId: string) {
    return await this.bookmarkRepository.deleteOne(bookmarkId);
  }

  async sortable(bookmarkId: string, to: number) {
    const bookmark = await this.bookmarkRepository.findOneById(bookmarkId);
    const { order: from, parent_id } = bookmark;
    let start: number;
    let end: number;
    let temp: number;
    if (from < to) {
      start = from + 1;
      end = to;
      temp = -1;
    } else {
      start = to;
      end = from - 1;
      temp = +1;
    }
    const bookmarks = await this.bookmarkRepository.findBetweenOrder(parent_id, start, end);
    bookmarks.forEach(async (item) => {
      const order = item.order + temp;
      await this.bookmarkRepository.updateOrder(item._id, order);
    });
    const result = await this.bookmarkRepository.updateOrder(bookmarkId, to);
    return result;
  }
}
