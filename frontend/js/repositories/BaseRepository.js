import IndexedDB from "../lib/IndexedDB.js";

class BaseRepository {
  constructor(transactionName) {
    this.transaction = transactionName;
    this.db = IndexedDB.db;
  }

  findAll() {
    return new Promise((resolve, _reject) => {
      const objectStore = this.db
        .transaction([this.transaction], "readonly")
        .objectStore(this.transaction);
      const result = [];
      const request = objectStore.openCursor();
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      request.onerror = (_event) => {
        resolve(result);
      };
    });
  }

  findOne(itemId) {
    return new Promise((resolve, _reject) => {
      const request = this.db
        .transaction([this.transaction], "readonly")
        .objectStore(this.transaction)
        .get(+itemId);

      request.onsuccess = (_event) => {
        const cursor = request.result;
        resolve(cursor);
      };
      request.onerror = (_event) => {
        resolve(null);
      };
    });
  }

  findConditionIn(indexName, values) {
    return new Promise((resolve, reject) => {
      const result = [];

      const tx = this.db.transaction([this.transaction], "readonly");

      tx.oncomplete = function (_event) {
        resolve(result.sort((a, b) => a.created_date - b.created_date));
      };

      tx.onerror = function (event) {
        reject(event.target.error);
      };

      const store = tx.objectStore(this.transaction).index(indexName);

      function onsuccess(event) {
        const cursor = event.target.result;
        if (cursor) {
          const value = cursor.value;
          const exists = result.some((item) => item.id === value.id);
          if (!exists) {
            result.push(value);
          }
          cursor.continue();
        }
      }

      for (const value of values) {
        // IDBKeyRange.only is implied in this next line
        const request = store.openCursor(IDBKeyRange.only(value));
        request.onsuccess = onsuccess;
      }
    });
  }

  insertOne(item) {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([this.transaction], "readwrite")
        .objectStore([this.transaction])
        .add(item);

      request.onsuccess = function (_event) {
        resolve("Success");
      };
    });
  }

  updateOne(item) {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([this.transaction], "readwrite")
        .objectStore(this.transaction)
        .put(item);

      request.onsuccess = (_event) => {
        resolve("Success");
      };
      request.onerror = (_event) => {
        resolve(null);
      };
    });
  }

  insertOrUpdateListItem(listItem) {
    const request = this.db
      .transaction([this.transaction], "readwrite")
      .objectStore(this.transaction);

    listItem.forEach((element) => {
      request.put(element);
    });
    request.oncomplete = function () {
      // All requests have succeeded and the transaction has committed.
      console.log("Done");
    };
  }

  delete(itemId) {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([this.transaction], "readwrite")
        .objectStore(this.transaction)
        .delete(+itemId);

      request.onsuccess = function (_event) {
        resolve("Success");
      };
    });
  }

  cleanData() {
    return new Promise((resolve) => {
      const request = this.db
        .transaction([this.transaction], "readwrite")
        .objectStore(this.transaction)
        .clear();

      request.onsuccess = function (_event) {
        console.log("Clean done!!");
        resolve(true);
      };
    });
  }

  syncData = async (items) => {
    const transaction = this.db.transaction([this.transaction], "readwrite");

    const store = transaction.objectStore(this.transaction);

    return Promise.all(
      (items || []).map((record) => {
        return store.add({ ...record, parentId: record.parentId || 0 });
      })
    ).then(function () {
      return transaction.complete;
    });
  };
}

export default BaseRepository;
