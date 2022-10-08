import authService from "../../services/AuthService.js";
import Login from "../../components/Auth/Login.js";
import IndexedDB from "../../lib/IndexedDB.js";
import Layout from "./Layout.js";

class Todo {
  tabId;
  constructor(tabId) {
    this.tabId = tabId;
  }

  async render() {
    await IndexedDB.connectDB();
    if (authService.isAuth) {
      new Layout(this.tabId).render("todo_app");
    } else {
      Login.render("todo_app");
    }
  }
}

export default Todo;
