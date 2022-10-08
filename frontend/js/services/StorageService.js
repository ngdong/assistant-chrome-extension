class StorageService {
  constructor() {
  }

  static getItem = (itemValue) => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([itemValue], function(result) {
        if (result.hasOwnProperty(itemValue)) {
          resolve(result[itemValue]);
        } else {
          resolve('');
        }
      });
    })
  }

  static setItem = (itemKey, itemValue) => {
    return new Promise((resolve) => {
      chrome.storage.sync.set({[itemKey]: itemValue}, function(result) {
        resolve(true);
      });
    })
  }

}
export default StorageService;
