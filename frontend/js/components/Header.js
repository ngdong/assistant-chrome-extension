import { BOOKMARK_TYPE, FOLDER_ICON, ACTIONS } from "./../constant.js";
import bookmarkService from "../services/BookmarkService.js";
class Header {
  bookmarkId;

  constructor(_bookmarkId) {
    this.bookmarkId = _bookmarkId;
  }

  createMarkup(isHomePage, isExist, title) {
    return `
      <div class="header">
        <div class="header-action-left">
          ${
            isHomePage
              ? '<a class="btn-back" href="#"><img src="icons/back.png" alt="Back"></a>'
              : ""
          }
        </div>
        <div class="header-title">
            <p>${title}</p>
        </div>
        <div class="header-action-right">
          <a class="btn-sync-data" id="btn-sync-data">
            <img src="icons/sync.svg" alt="Add sync data">
          </a>
          ${
            isExist
              ? ""
              : '<a class="btn-bookmark" id="btn-bookmark"><img src="icons/bookmark.png" alt="Bookmark"></a>'
          }
          <a class="btn-add-folder" id="btn-create-folder">
            <img src="icons/add.png" alt="Add folder">
          </a>
        </div>
      </div>
    `;
  }

  async render(selector = "app") {
    const isHomePage = this.bookmarkId !== "root";
    const isExist = await this.checkHasBookmark();
    const title = await bookmarkService.getBookmarkTitleById(this.bookmarkId);
    console.log(title);
    const markup = this.createMarkup(isHomePage, isExist, title);
    const parent = document.getElementById(selector);
    parent.innerHTML = markup;
    this.bindEvents();
  }

  checkHasBookmark() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const currentTab = tabs.find(Boolean);
        const { url } = currentTab;
        const isExist = bookmarkService.checkHasBookmark(url);
        resolve(isExist);
      });
    });
  }

  // Bind an events on click form the login form
  bindEvents() {
    // Create Bookmark
    const btn = document.getElementById("btn-bookmark");
    if (btn) {
      btn.addEventListener("click", (e) => this.createBookmark(e));
    }

    // Create folder
    const btnAddFolder = document.getElementById("btn-create-folder");
    if (btnAddFolder) {
      btnAddFolder.addEventListener("click", (e) => this.createFolder(e));
    }

    // Sync data
    const btnSyncData = document.getElementById("btn-sync-data");
    if (btnSyncData) {
      btnSyncData.addEventListener("click", (e) => this.syncData(e));
    }
  }

  syncData() {
    chrome.runtime.sendMessage({ action: ACTIONS.SYNC_DATA }, (response) => {
      // response will be received from the background script
      if (response) {
        location.reload();
      }
    });
  }

  createBookmark(e) {
    e.preventDefault();
    const global = this;
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs.find(Boolean);
      const { favIconUrl, title, url } = currentTab;
      const base64Icon = !!favIconUrl
        ? await global.convertImgToBase64URL(favIconUrl)
        : "";
      const input = {
        icon: base64Icon,
        title: title,
        link: url,
        parent_id: global.bookmarkId,
        type: BOOKMARK_TYPE.Web,
        order: 1,
      };
      try {
        chrome.runtime.sendMessage(
          { action: ACTIONS.BOOKMARK_LINK, data: input },
          (response) => {
            // response will be received from the background script
            if (response) {
              location.reload();
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  }

  convertImgToBase64URL(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("CANVAS");
        const ctx = canvas.getContext("2d");
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = url;
    });
  }

  createFolder(event) {
    event.preventDefault();
    const global = this;
    const markup = this.createMarkupModal();
    const appWrapper = document.getElementById("app-wrapper");
    const modal = document.getElementById("add-modal");
    modal.innerHTML = markup;
    modal.style.display = "block";
    appWrapper.classList.add("open-modal");

    const form = document.getElementById("create-folder");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const el = e.target;
      const { value: title } = el.title;
      if (!title) {
        return;
      }
      const input = {
        icon: FOLDER_ICON,
        title: title,
        link: "",
        parent_id: global.bookmarkId,
        type: BOOKMARK_TYPE.Folder,
        order: 1,
      };
      try {
        chrome.runtime.sendMessage(
          { action: ACTIONS.BOOKMARK_LINK, data: input },
          (response) => {
            // response will be received from the background script
            if (response) {
              location.reload();
            }
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
    const btnClose = document.getElementById("btn-close-modal");
    btnClose.addEventListener("click", () => {
      modal.style.display = "none";
      appWrapper.classList.remove("open-modal");
    });
  }

  createMarkupModal() {
    return `
      <div class="modal-content">
        <a class="close-modal" id="btn-close-modal">X</a>
        <form method="post" id="create-folder">
          <div class="form-control">
              <div class="form-label">
                  <span>Title</span>
              </div>
              <div class="form-input">
                  <input type="text" name="title" id="title" required placeholder=" ">
              </div>
          </div>
          <div class="form-action">
              <button type="submit" id="submit-login">Create</button>
          </div>
        </form>
      </div>
    `;
  }
}
export default Header;
