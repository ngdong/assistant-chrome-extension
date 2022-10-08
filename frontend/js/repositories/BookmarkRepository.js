import { TRANSACTION_NAME } from "../constant.js";
import BaseRepository from "./BaseRepository.js";

class BookmarkRepository extends BaseRepository {
  constructor() {
    super(TRANSACTION_NAME.BOOKMARK);
  }

  getChildren = (itemId) => {
    return new Promise((resolve, _reject) => {
      const objectStore = this.db
        .transaction([TRANSACTION_NAME.BOOKMARK], "readonly")
        .objectStore(TRANSACTION_NAME.BOOKMARK);
      const index = objectStore.index("parentId");
      const request = index.getAll(+itemId);
      request.onsuccess = (_event) => {
        const result = request.result;
        resolve(result);
      };
      request.onerror = (_event) => {
        resolve([]);
      };
    });
  };

  removeChildren = (itemId) => {
    return new Promise((resolve, _reject) => {
      const objectStore = this.db
        .transaction([TRANSACTION_NAME.BOOKMARK], "readwrite")
        .objectStore(TRANSACTION_NAME.BOOKMARK);
      const index = objectStore.index("parentId");
      const request = index.openCursor(IDBKeyRange.only(+itemId));
      request.onsuccess = (_event) => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve("Success");
        }
      };
      request.onerror = (_event) => {
        resolve("Error");
      };
    });
  };

  sortable = async (bookmarkId, to) => {
    const bookmark = await this.findOne(bookmarkId);
    if (!bookmark) {
      return;
    }
    const { parentId, order: from } = bookmark;
    const siblingItems = await this.getChildren(parentId);
    let start, end, temp;
    if (from < to) {
      start = from + 1;
      end = to;
      temp = -1;
    } else {
      start = to;
      end = from - 1;
      temp = +1;
    }
    const bookmarks = siblingItems.reduce(function (arr, item) {
      if (bookmarkId === item.id) {
        item.order = to;
      } else if (start <= +item.order && +item.order <= end) {
        item.order = item.order + temp;
      }
      arr.push(item);
      return arr;
    }, []);
    this.insertOrUpdateListItem(bookmarks);
  };

  updateItemParent = async (bookmarkId, parentId) => {
    const bookmark = await this.findOne(bookmarkId);
    if (!bookmark) {
      return;
    }
    const newBookmark = { ...bookmark, parentId: parentId };
    await this.updateOne(newBookmark);
  };

  checkIsExistBookmark(link) {
    return new Promise((resolve, _reject) => {
      const objectStore = this.db
        .transaction([TRANSACTION_NAME.BOOKMARK], "readonly")
        .objectStore(TRANSACTION_NAME.BOOKMARK);
      const index = objectStore.index("link");
      const request = index.getAll(link);
      request.onsuccess = (_event) => {
        const result = request.result;
        const isExist = result && Array.isArray(result) && result.length > 0;
        resolve(isExist);
      };
      request.onerror = (_event) => {
        resolve(false);
      };
    });
  }
}

export default BookmarkRepository;
