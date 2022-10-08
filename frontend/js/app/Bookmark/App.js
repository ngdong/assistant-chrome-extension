import authService from "../../services/AuthService.js";
import Login from "../../components/Auth/Login.js";
import Layout from "./Layout.js";
import { ACTIONS } from "../../constant.js";

class App {
  bookmarkId;

  constructor(_bookmarkId) {
    this.bookmarkId = _bookmarkId;
    this.handleLoadingIndicator();
  }

  async render() {
    if (authService.isAuth) {
      const layout = new Layout(this.bookmarkId);
      layout.render("app");
    } else {
      Login.render("app");
    }
  }

  handleLoadingIndicator() {
    const global = this;
    chrome.runtime.onMessage.addListener(function (
      request,
      _sender,
      sendResponse
    ) {
      const { action, data } = request;
      if (action === ACTIONS.LOADING) {
        data ? global.openLoading() : global.closeLoading();
        sendResponse({ data: "done" });
      }
      return true; // This is required by a Chrome Extension
    });
  }

  openLoading() {
    const markup = '<div class="loader"><img src="icons/spinner.svg"></div>';
    const appWrapper = document.getElementById("app-wrapper");
    const modal = document.getElementById("add-modal");
    modal.innerHTML = markup;
    modal.style.display = "block";
    appWrapper.classList.add("open-modal");
  }

  closeLoading() {
    const appWrapper = document.getElementById("app-wrapper");
    const modal = document.getElementById("add-modal");
    modal.style.display = "none";
    appWrapper.classList.remove("open-modal");
  }
}

export default App;
