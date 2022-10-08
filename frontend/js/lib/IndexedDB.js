import { DB_NAME, DB_VERSION, TRANSACTION_NAME } from "./../constant.js";

class IndexedDB {
  db;
  constructor() {}

  connectDB() {
    return new Promise((resolve, reject) => {
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
        const bookmark = this.db.createObjectStore(TRANSACTION_NAME.BOOKMARK, {
          keyPath: "id",
        });
        bookmark.createIndex("parentId", "parentId", { unique: false });
        bookmark.createIndex("link", "link", { unique: false });

        const todo = this.db.createObjectStore(TRANSACTION_NAME.TODO, {
          keyPath: "id",
        });
        todo.createIndex("statuses", "status", { unique: false });

        const note = this.db.createObjectStore(TRANSACTION_NAME.NOTE, {
          keyPath: "id",
        });
        resolve("Success");
      };
    });
  }
}

const db = new IndexedDB();
export default db;
