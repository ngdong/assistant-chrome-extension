import StorageService from "./StorageService.js";

class CacheService {
  constructor() {}

  async recentKey(key) {
    try {
      const value = await StorageService.getItem(key);
      return value;
    } catch (e) {
      console.log(e);
    }
  }

  async setRecentKey(key, value) {
    await StorageService.setItem(key, value);
  }
}
const cacheService = new CacheService();
export default cacheService;
