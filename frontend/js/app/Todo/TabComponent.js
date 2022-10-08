import cacheService from "../../services/CacheService.js";
import {CACHE_STORAGE_KEYS, EVENTS} from "../../constant.js";
import EventManager from "../../lib/EventManager.js";

class TabComponent {
  tabId;
  tabItems = [
    { id: 'notifications', title: 'Notifications' },
    { id: 'todo', title: 'Todo' },
    { id: 'note', title: 'Note' },
  ];
  eventManager;
  constructor(tabId) {
    this.tabId = tabId;
    this.eventManager = EventManager.getInstance();
  }

  createMarkup() {
    return `
      <div class="header">
        <ul class="tab_list">
          ${
            this.tabItems.map((item) => {
              return `
                <li class="tab_item ${item.id === this.tabId ? 'active' : ''}" data-item="${item.id}">
                  <a href="#/${item.id}" target="_self">${item.title}</a>
                </li>`;
            }).join("\n")
          }
        </ul>
      </div>
    `;
  }

  async render(selector) {
    const markup = this.createMarkup();
    const parent = document.getElementById(selector);
    parent.insertAdjacentHTML('afterbegin', markup);
    this.bindEvents();
  }

  // Bind an events on click form the login form
  bindEvents() {
    // Select tab
    document.querySelectorAll(".tab_item").forEach(item => {
      item.addEventListener("click", (e) => this.selectTab(e));
    });
  }

  async selectTab(e) {
    e.preventDefault();
    document.querySelectorAll('.tab_item').forEach(item => {
      item.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
    const tabId = e.currentTarget.getAttribute("data-item");
    this.eventManager.publish(EVENTS.SELECTED_TAB, tabId);
    await cacheService.setRecentKey(CACHE_STORAGE_KEYS.TAB_ID, tabId);
  }
}
export default TabComponent;
