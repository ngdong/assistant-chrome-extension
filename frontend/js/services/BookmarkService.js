import BaseService from "./BaseService.js";
import BookmarkRepository from "../repositories/BookmarkRepository.js";

export class BookmarkService extends BaseService {
  bookmarkRepository;
  constructor() {
    super();
    this.bookmarkRepository = new BookmarkRepository();
  }

  async getBookmarkTitleById(bookmarkId) {
    if (bookmarkId === 0) {
      return "Bookmarks";
    }
    try {
      let result = await this.bookmarkRepository.findOne(bookmarkId);
      return result ? result.title : "Bookmarks";
    } catch (error) {
      return "Bookmarks";
    }
  }

  async getAll() {
    try {
      const result = await this.get("bookmarks");
      return result.data;
    } catch (error) {
      return [];
    }
  }

  async getByParentId(parentId) {
    try {
      let result = await this.bookmarkRepository.getChildren(parentId);
      const bookmarks = result.sort((a, b) => a.order - b.order);
      return bookmarks;
    } catch (error) {
      return [];
    }
  }

  async createBookmark(bookmarkInput) {
    try {
      const result = await this.post(`bookmarks`, bookmarkInput);
      const { data } = result;
      await this.bookmarkRepository.insertOne(data);
      return result;
    } catch (error) {
      return [];
    }
  }

  async deleteBookmark(bookmarkId) {
    try {
      const result = await this.delete(`bookmarks/${bookmarkId}`);
      if (result.data) {
        await this.bookmarkRepository.delete(bookmarkId);
        await this.bookmarkRepository.removeChildren(bookmarkId);
      }
      return result.data;
    } catch (error) {
      return [];
    }
  }

  async sortable(bookmarkId, to) {
    try {
      await this.bookmarkRepository.sortable(bookmarkId, to);
      const result = await this.post(`bookmarks/sort/${bookmarkId}/${to}`);
      return result;
    } catch (error) {
      return [];
    }
  }

  async checkHasBookmark(url) {
    const isExit = await this.bookmarkRepository.checkIsExistBookmark(url);
    return isExit;
  }

  async syncData() {
    await Promise.all([
      this.get("bookmarks"),
      this.bookmarkRepository.cleanData(),
    ]).then(async ([bookmarks]) => {
      await this.bookmarkRepository.syncData(bookmarks.data);
    });
    return;
  }

  async updateItemParent(itemId, parentId) {
    try {
      await this.bookmarkRepository.updateItemParent(itemId, parentId);
      return true;
    } catch (error) {
      return [];
    }
  }
}

export default BookmarkService;
