import BaseService from "./BaseService.js";
import IndexedDB from "../lib/IndexedDB.js";
export class BookmarkService extends BaseService {
  constructor() {
    super();
  }

  async getBookmarkTitleById(bookmarkId) {
    if (bookmarkId === "root") {
      return "Bookmarks";
    }
    try {
      let result = await IndexedDB.findOne(bookmarkId);
      return result ? result.title : "Bookmarks";
    } catch (error) {
      return "Bookmarks";
    }
  }

  async getAll() {
    try {
      const result = await this.get("bookmark/bookmarks");
      return result;
    } catch (error) {
      return [];
    }
  }

  async getByParentId(parentId) {
    try {
      let result = await IndexedDB.getChildren(parentId);
      const bookmarks = result.sort((a, b) => a.order - b.order);
      return bookmarks;
    } catch (error) {
      return [];
    }
  }

  async createBookmark(bookmarkInput) {
    try {
      const result = await this.post(`bookmark/create`, bookmarkInput);
      const { bookmark } = result;
      await IndexedDB.insertOne(bookmark);
      return result;
    } catch (error) {
      return [];
    }
  }

  async deleteBookmark(bookmarkId) {
    try {
      const result = await this.delete(`bookmark/delete/${bookmarkId}`);
      if (result) {
        IndexedDB.remove(bookmarkId);
        IndexedDB.removeChildren(bookmarkId);
      }
      return result;
    } catch (error) {
      return [];
    }
  }

  async sortable(bookmarkId, to) {
    try {
      await IndexedDB.sortable(bookmarkId, to);
      const result = await this.get(`bookmark/sortable/${bookmarkId}/${to}`);
      return result;
    } catch (error) {
      return [];
    }
  }

  async checkHasBookmark(url) {
    const isExit = await IndexedDB.checkIsExistBookmark(url);
    return isExit;
  }

  async syncData() {
    await Promise.all([
      this.get("bookmark/bookmarks"),
      IndexedDB.cleanData(),
    ]).then(async ([bookmarks]) => {
      await IndexedDB.syncData(bookmarks);
      console.log("done");
    });
    return;
  }

  async updateItemParent(itemId, parentId) {
    try {
      await IndexedDB.updateItemParent(itemId, parentId);
      return true;
    } catch (error) {
      return [];
    }
  }
}

const bookmarkService = new BookmarkService();
export default bookmarkService;
