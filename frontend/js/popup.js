import App from "./app/Bookmark/App.js";
import { CACHE_STORAGE_KEYS } from "./constant.js";
import cacheService from "./services/CacheService.js";

async function renderApp(bookmarkId, selector = "app") {
  await cacheService.setRecentKey(CACHE_STORAGE_KEYS.BOOKMARK_ID, bookmarkId);
  new App(bookmarkId).render(selector);
}

const recentId =
  (await cacheService.recentKey(CACHE_STORAGE_KEYS.BOOKMARK_ID)) || 0;
renderApp(recentId);

window.addEventListener("hashchange", function (event) {
  const bookmarkId = location.hash.includes("#/")
    ? location.hash.replace("#/", "")
    : 0;
  renderApp(bookmarkId);
});
