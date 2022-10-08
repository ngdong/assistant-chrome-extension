import TodoService from "../../services/TodoService.js";
import TodoItem from "./TodoItem.js";
import EventManager from "../../lib/EventManager.js";
import { EVENTS } from "../../constant.js";

class TodoList {
  constructor(selector) {
    this.selector = selector;
    this.todoService = new TodoService();
    this.eventManager = EventManager.getInstance();
    this.eventManager.subscribe(EVENTS.TODO_CREATED, () => this.render());
  }

  async getListTodo() {
    try {
      const todos = await this.todoService.getUncompletedTask();
      return todos;
    } catch (error) {
      return [];
    }
  }

  async createMarkup(todos) {
    return `
      <div class="todo_list">
        ${todos.map((item, index) => TodoItem(item, index)).join("\n")}
      </div>
      <div class="todo_footer">
        <a id="btn_open_modal"><i class="material-icons">&#xE145;</i></a>
      </div>
      <div class="todo_create_new">
        <div class="row form-control">
          <input type="text" class="input_title" placeholder="Task name here..." />
        </div>
        <div class="row form-control">
          <textarea rows="3" class="input_description" required placeholder="Description"></textarea>
        </div>
        <div class="row form-action">
          <a class="btn btn_cancel" id="btn_cancel">Cancel</a>
          <a class="btn btn_add_task" id="btn_add_task">Add Task</a>
        </div>
      </div>
    `;
  }

  async render() {
    const todos = await this.getListTodo();
    const markup = await this.createMarkup(todos);
    const parent = document.getElementById(this.selector);
    parent.innerHTML = markup;
    this.bindEvents();
  }

  bindEvents() {
    document
      .getElementById("btn_open_modal")
      .addEventListener("click", (e) => this.toggleModal(e));
    document
      .getElementById("btn_cancel")
      .addEventListener("click", (e) => this.toggleModal(e));
    document
      .getElementById("btn_add_task")
      .addEventListener("click", (e) => this.createTask(e));
    document
      .querySelectorAll("input[type=checkbox][name=mask_done]")
      .forEach((item) => {
        item.addEventListener("change", (e) => this.maskDone(e));
      });
  }

  toggleModal(e) {
    const modal = document.querySelector(".todo_create_new");
    if (modal) {
      modal.classList.toggle("todo_create_new_active");
    }
  }

  async createTask(event) {
    try {
      let description = document.querySelector(".input_description").value;
      let title = document.querySelector(".input_title").value;
      if (!title || title === "") {
        return;
      }
      await this.todoService.create({ title, description });
      this.toggleModal(event);
      this.eventManager.publish(EVENTS.TODO_CREATED, {});
    } catch (e) {
      console.error(e);
    }
  }

  async maskDone(event) {
    const checked = event.target.checked;
    const todoId = event.target.getAttribute("data-id");
    if (checked && todoId) {
      await this.todoService.maskDone(todoId);
      const item = event.target.parentNode.parentNode;
      item.classList.add("completed");
    }
  }
}
export default TodoList;
