import App from "./components/App.js";
import cacheService from './services/CacheService.js';

function renderApp(bookmarkId, selector = "app") {
  cacheService.setRecentKey(bookmarkId);
  new App(bookmarkId).render(selector);
}

const recentId = cacheService.recentKey;
renderApp(recentId);

window.addEventListener("hashchange", function (event) {
  const bookmarkId = location.hash.includes("#/") ? location.hash.replace("#/", "") : 0;
  renderApp(bookmarkId);
});
