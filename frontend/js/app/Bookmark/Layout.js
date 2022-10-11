import Header from "./Header.js";
import BookmarkPage from "./Bookmark/BookmarkPage.js";
import IndexedDB from "../../lib/IndexedDB.js";

class Layout {
  bookmarkId;

  constructor(_bookmarkId) {
    this.bookmarkId = _bookmarkId;
  }

  createMarkup = () => {
    const container = document.createElement("div");
    container.id = "app-container";
    container.className = "container app-container";
    return container;
  };

  async render(selector = "app") {
    await IndexedDB.connectDB();
    await new Header(this.bookmarkId).render(selector);
    const markup = this.createMarkup();
    const parent = document.getElementById(selector);
    parent.appendChild(markup);
    await new BookmarkPage(this.bookmarkId).render("app-container");
  }
}
export default Layout;
