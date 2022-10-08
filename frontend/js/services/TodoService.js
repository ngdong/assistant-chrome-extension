import BaseService from "./BaseService.js";
import TodoRepository from "../repositories/TodoRepository.js";
import { TODO_STATUS } from "../constant.js";

export class TodoService extends BaseService {
  todoRepository;
  constructor() {
    super();
    this.todoRepository = new TodoRepository();
  }

  async getAll() {
    try {
      /* const result = await this.get("todos"); */
      const result = await this.todoRepository.findAll();
      return result;
    } catch (error) {
      return [];
    }
  }

  createUUID() {
    let dt = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
    return uuid;
  }

  async getUncompletedTask() {
    try {
      const result = await this.todoRepository.findConditionIn("statuses", [
        TODO_STATUS.NEW,
        TODO_STATUS.PAST_DUE,
      ]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async create(todoInput) {
    try {
      todoInput.id = this.createUUID();
      todoInput.status = TODO_STATUS.NEW;
      todoInput.created_date = new Date().getTime();
      await this.todoRepository.insertOne(todoInput);
      return result;
    } catch (error) {
      return [];
    }
  }

  async maskDone(todoId) {
    const todo = await this.todoRepository.findOne(todoId);
    if (!todo) {
      return;
    }
    const newTodo = { ...todo, status: TODO_STATUS.COMPLETED };
    await this.todoRepository.updateOne(newTodo);
  }
}

export default TodoService;
