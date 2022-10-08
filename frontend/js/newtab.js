import Todo from './app/Todo/index.js';
import { CACHE_STORAGE_KEYS } from './constant.js';
import cacheService from './services/CacheService.js';

(async function () {
  const tabId = await cacheService.recentKey(CACHE_STORAGE_KEYS.TAB_ID) || "todo";
  const selector = "todo_app";
  new Todo(tabId).render(selector);
})();
