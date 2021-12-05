import authService from "../../services/AuthService.js";

class Login {
  constructor() {}

  createMarkup() {
    // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
    return `
      <div class="login-form form-group" id="login-page">
        <p class="form-title">Login</p>
        <form method="post">
            <div class="form-control">
                <div class="form-label">
                    <span>Username</span>
                </div>
                <div class="form-input">
                    <input type="email" name="username" id="username" required placeholder=" ">
                </div>
            </div>
            <div class="form-control">
                <div class="form-label">
                    <span>Password</span>
                </div>
                <div class="form-input">
                    <input type="password" name="password" id="password" required placeholder=" ">
                </div>
            </div>
            <div class="form-action">
                <button type="submit" id="submit-login">Login</button>
            </div>
        </form>
      </div>
    `;
  }

  render(selector = "app") {
    const markup = this.createMarkup();
    const parent = document.getElementById(selector);

    parent.innerHTML = markup;
    this.bindEvents();
  }

  // Bind an events on submit form the login form
  bindEvents() {
    const form = document.getElementById("login-page");
    form.addEventListener("submit", async(e) => {
      e.preventDefault();

      const el = e.target;
      const { value: username } = el.username;
      const { value: password } = el.password;
      if (!username || !password) {
        return;
      }
      const result = await authService.login(username, password);
      if(result.isAuth) {
        location.reload();
      } else {
        console.log(result.msg);
      }
    });
  }
}
export default new Login();
