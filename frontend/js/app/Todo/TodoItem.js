import {isNil, formatDate} from "../../helper.js";

const TodoItem = (todo, _index) => {
  return `
    <div class="todo_item">
      <div class="todo_action">
        <input type="checkbox" name="mask_done" id="check-${todo.id}" data-id="${todo.id}" />
        <label for="check-${todo.id}"></label>
      </div>
      <div class="todo_content">
        <div class="title">
          <p>${todo.title}</p>
        </div>
        ${
          isNil(todo.description)
          ? ""
          : `<div class="description"><p>${todo.description.replace(/\n/g, '<br/>')}</p></div>`
        }
        ${
          isNil(todo.deadline)
          ? ""
          : `<div class="deadline">
            <span class="material-icons">
              calendar_month
            </span>
            <span class="date">${formatDate(todo.deadline)}</span>
          </div>`
        }
      </div>
    </div>
  `;
};

export default TodoItem ;
