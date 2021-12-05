import { CACHE_STORAGE_KEYS } from '../constant.js';

class CacheService {
  cacheStorage;
  constructor() {
    this.cacheStorage = window.localStorage;
  }

  get recentKey() {
    try{
      const key = this.cacheStorage.getItem(CACHE_STORAGE_KEYS.RECENT_ID);
      return key || 'root';
    } catch {
      return 'root';
    }
  }

  setRecentKey(key) {
    this.cacheStorage.setItem(CACHE_STORAGE_KEYS.RECENT_ID, key);
  }

}
const cacheService = new CacheService();
export default cacheService;
