import TabComponent from "./TabComponent.js";
import TodoList from "./TodoList.js";
import NotificationList from "./NotificationList.js";
import Note from "./Note.js";
import EventManager from "../../lib/EventManager.js";
import { EVENTS } from "../../constant.js";

class Layout {
  tabId;
  constructor(tabId) {
    this.tabId = tabId;
    const eventManager = EventManager.getInstance();
    eventManager.subscribe(EVENTS.SELECTED_TAB, (tabId)=> this.renderTabContent(tabId));
  }

  createMarkup = () => {
    const container = document.createElement("div");
    container.className = "container";
    container.id = "app_container";
    return container;
  };

  async render(selector) {
    const markup = this.createMarkup();
    const parent = document.getElementById(selector);
    parent.appendChild(markup);
    await new TabComponent(this.tabId).render("app_container");
    this.renderContent("app_container");
    await this.renderTabContent(this.tabId);
  }

  async renderTabContent(tabId) {
    switch (tabId) {
      case "todo":
        await new TodoList("app_content").render();
        break;
      case "notifications":
        await new NotificationList().render("app_content");
        break;
      case "note":
        await new Note().render("app_content");
        break;
    }
  }

  renderContent(selector) {
    const markup =  `
      <div class="content" id="app_content">
      </div>
    `;
    const parent = document.getElementById(selector);
    parent.insertAdjacentHTML('beforeend', markup);
  }
}
export default Layout;
