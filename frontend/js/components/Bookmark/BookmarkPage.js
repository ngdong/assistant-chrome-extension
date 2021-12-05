import bookmarkService from "../../services/BookmarkService.js";
import BookmarkList from "./BookmarkList.js";
import { BOOKMARK_TYPE } from "../../constant.js";

class BookmarkPage {
  bookmarkId;
  bookmarks = null;
  constructor(_bookmarkId) {
    this.bookmarkId = _bookmarkId;
  }

  async createMarkup(bookmarks) {
    if (bookmarks && bookmarks.length === 0) {
      try {
        this.bookmarks = await bookmarkService.getByParentId(this.bookmarkId);
        return `${BookmarkList(this.bookmarks)}`;
      } catch (error) {
        console.log(error);
        return "";
      }
    }
    return `${BookmarkList(bookmarks)}`;
  }

  async render(selector = "app", bookmarks = []) {
    const markup = await this.createMarkup(bookmarks);
    const parent = document.getElementById(selector);
    parent.innerHTML = markup;
    this.bindDeleteEvent();
    this.bindDragAndDropEvent();
  }

  bindDeleteEvent() {
    const btn = document.querySelectorAll(".btn-delete-bookmark");
    if (!btn || btn.length === 0) {
      return;
    }
    btn.forEach((item) => {
      item.addEventListener("click", async (e) => {
        e.preventDefault();
        const _bookmarkId = e.currentTarget.getAttribute("data-id");
        const isDelete = await bookmarkService.deleteBookmark(_bookmarkId);
        if (isDelete) {
          location.reload();
        }
      });
    });
  }

  bindDragAndDropEvent() {
    const global = this;
    const items = document.querySelectorAll(".bookmark-list .item");
    let dragSrcEl = null;
    items.forEach(function (item) {
      item.addEventListener("dragstart", handleDragStart, false);
      item.addEventListener("dragover", handleDragOver, false);
      item.addEventListener("dragenter", handleDragEnter, false);
      item.addEventListener("dragleave", handleDragLeave, false);
      item.addEventListener("drop", handleDrop, false);
      item.addEventListener("dragend", handleDragEnd, false);
    });

    function handleDragStart(e) {
      this.style.opacity = "0.4";
      dragSrcEl = this;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", this.innerHTML);
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = "move";
      return false;
    }

    function handleDragEnter(e) {
      this.classList.add("over");
    }

    function handleDragLeave(e) {
      this.classList.remove("over");
    }

    async function handleDrop(e) {
      e.stopPropagation();
      if (dragSrcEl !== this) {
        const itemId = dragSrcEl.getAttribute("data-id");
        const from = +dragSrcEl.getAttribute("data-order");
        const to = +this.getAttribute("data-order");
        const toType = +this.getAttribute("data-type");
        const parentId = this.getAttribute("data-id");
        if (toType === BOOKMARK_TYPE.Folder) {
          await bookmarkService.updateItemParent(itemId, parentId);
          global.render("app-container");
          return;
        }
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
        const bookmarks = global.bookmarks
          .reduce(function (arr, item) {
            if (itemId === item._id) {
              item.order = to;
            } else if (start <= +item.order && +item.order <= end) {
              item.order = item.order + temp;
            }
            arr.push(item);
            return arr;
          }, [])
          .sort((a, b) => a.order - b.order);
        await bookmarkService.sortable(itemId, to);
        global.render("app-container", bookmarks);
      }
      return false;
    }

    function handleDragEnd(e) {
      this.style.opacity = "1";
      items.forEach(function (item) {
        item.classList.remove("over");
      });
    }
  }
}
export default BookmarkPage;
