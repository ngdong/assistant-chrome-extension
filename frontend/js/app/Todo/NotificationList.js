import NotificationItem from "./NotificationItem.js";

class NotificationList {
  constructor() {}

  async getListNotification() {
    try {
      /* const notifications = await todoService.getAll(); */
      return [];
    } catch (error) {
      return [];
    }
  }

  async createMarkup(notifications) {
    return `
      <div class="notification_list">
        ${notifications.map((item, index) => NotificationItem(item, index)).join("\n")}
      </div>
    `;;
  }

  async render(selector) {
    const todos = await this.getListNotification();
    const markup = await this.createMarkup(todos);
    const parent = document.getElementById(selector);
    parent.innerHTML = markup;
  }
}
export default NotificationList;
