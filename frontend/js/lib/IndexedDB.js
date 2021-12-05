import { DB_NAME, DB_VERSION, TRANSACTION_NAME } from "./../constant.js";

class IndexedDB {
  db;
  constructor() {}

  connectDB = () => {
    return new Promise((resolve, reject) => {
      let indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        reject("Error");
      };

      request.onsuccess = (event) => {
        this.db = request.result;
        resolve("Success");
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target.result;
        const bookmark = this.db.createObjectStore(TRANSACTION_NAME, {
          keyPath: "_id",
        });
        bookmark.createIndex("parent_id", "parent_id", { unique: false });
        bookmark.createIndex("link", "link", { unique: false });
        resolve("Success");
      };
    });
  };

  getChildren = (itemId) => {
    return new Promise((resolve, reject) => {
      const objectStore = this.db
        .transaction([TRANSACTION_NAME], "readonly")
        .objectStore(TRANSACTION_NAME);
      const index = objectStore.index("parent_id");
      const request = index.getAll(itemId);
      request.onsuccess = (event) => {
        const result = request.result;
        resolve(result);
      };
      request.onerror = (event) => {
        resolve([]);
      };
    });
  };

  getAll() {
    return new Promise((resolve, reject) => {
      const objectStore = this.db
        .transaction([TRANSACTION_NAME], "readonly")
        .objectStore(TRANSACTION_NAME);
      const result = [];
      const request = objectStore.openCursor();
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          result.push(cursor);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      request.onerror = (event) => {
        resolve(result);
      };
    });
  }

  findOne(itemId) {
    return new Promise((resolve, reject) => {
      const request = this.db
        .transaction([TRANSACTION_NAME], "readonly")
        .objectStore(TRANSACTION_NAME)
        .get(itemId);

      request.onsuccess = (event) => {
        const cursor = request.result;
        resolve(cursor);
      };
      request.onerror = (event) => {
        resolve(null);
      };
    });
  }

  insertOne(item) {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([TRANSACTION_NAME], "readwrite")
        .objectStore(TRANSACTION_NAME)
        .add(item);

      request.onsuccess = function (event) {
        resolve("Success");
      };
    });
  }

  updateOne(item) {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([TRANSACTION_NAME], "readwrite")
        .objectStore(TRANSACTION_NAME)
        .put(item);

      request.onsuccess = (event) => {
        resolve("Success");
      };
      request.onerror = (event) => {
        resolve(null);
      };
    });
  }

  insertOrUpdateListItem(listItem) {
    const request = this.db
      .transaction([TRANSACTION_NAME], "readwrite")
      .objectStore(TRANSACTION_NAME);

    listItem.forEach((element) => {
      request.put(element);
    });
    request.oncomplete = function () {
      // All requests have succeeded and the transaction has committed.
      console.log("Done");
    };
  }

  remove(itemId) {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([TRANSACTION_NAME], "readwrite")
        .objectStore(TRANSACTION_NAME)
        .delete(itemId);

      request.onsuccess = function (event) {
        resolve("Success");
      };
    });
  }

  removeChildren = (itemId) => {
    return new Promise((resolve, reject) => {
      const objectStore = this.db
        .transaction([TRANSACTION_NAME], "readwrite")
        .objectStore(TRANSACTION_NAME);
      const index = objectStore.index("parent_id");
      const request = index.openCursor(IDBKeyRange.only(itemId));
      request.onsuccess = (event) => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve("Success");
        }
      };
      request.onerror = (event) => {
        resolve("Error");
      };
    });
  };

  cleanData() {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([TRANSACTION_NAME], "readwrite")
        .objectStore(TRANSACTION_NAME)
        .clear();

      request.onsuccess = function (event) {
        resolve(true);
        console.log("Remove success");
      };
    });
  }

  syncData = async (items) => {
    const transaction = this.db.transaction([TRANSACTION_NAME], "readwrite");

    const store = transaction.objectStore(TRANSACTION_NAME);

    return Promise.all(
      (items || []).map((record) => {
        return store.add(record);
      })
    ).then(function () {
      console.log("done");
      return transaction.complete;
    });
  };

  sortable = async (bookmarkId, to) => {
    const bookmark = await this.findOne(bookmarkId);
    if (!bookmark) {
      return;
    }
    const { parent_id, order: from } = bookmark;
    const siblingItems = await this.getChildren(parent_id);
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
      if (bookmarkId === item._id) {
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
    const newBookmark = { ...bookmark, parent_id: parentId };
    await this.updateOne(newBookmark);
  };

  checkIsExistBookmark(link) {
    return new Promise((resolve, reject) => {
      const objectStore = this.db
        .transaction([TRANSACTION_NAME], "readonly")
        .objectStore(TRANSACTION_NAME);
      const index = objectStore.index("link");
      const request = index.getAll(link);
      request.onsuccess = (event) => {
        const result = request.result;
        const isExist = result && Array.isArray(result) && result.length > 0;
        resolve(isExist);
      };
      request.onerror = (event) => {
        resolve(false);
      };
    });
  }
}

export default new IndexedDB();
