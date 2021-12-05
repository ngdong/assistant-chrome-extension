import { TOKEN_KEY } from "../constant.js";
import BaseService from "./BaseService.js";

export class AuthService extends BaseService{
  _isAuth;
  constructor() {
    super();
    this.autoAuth();
  }

  autoAuth() {
    const token = this.getToken();
    this.isAuth = token && token !== '';
  }

  setIsAuth(status) {
    this.isAuth = status;
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  async login(email, password) {
    try {
      const result = await this.post('auth/login', {email: email, password: password});
      this.setIsAuth(true);
      this.setToken(result.token);
      return { isAuth: true };
    } catch(error) {
      console.log(error);
      return { isAuth: false, msg: error };
    }
  }
}
const authService = new AuthService();
export default authService;
