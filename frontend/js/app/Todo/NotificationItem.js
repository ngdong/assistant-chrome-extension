import {isNil} from "../../helper.js";

const NotificationItem = (notification, _index) => {
  return `
    <div class="todo_item">
      <div class="todo_content">
        <div class="title">
          <p>${notification.title}</p>
        </div>
        ${
          isNil(notification.description)
          ? ""
          : `<div class="description"><p>${notification.description}</p></div>`
        }
      </div>
    </div>
  `;
};

export default NotificationItem;
