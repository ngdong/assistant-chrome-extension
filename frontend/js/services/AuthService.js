import BaseService from "./BaseService.js";

export class AuthService extends BaseService {
  _isAuth;
  constructor() {
    super();
    this.autoAuth();
  }

  async autoAuth() {
    const token = await this.getToken();
    this.isAuth = token && token !== "";
  }

  setIsAuth(status) {
    this.isAuth = status;
  }

  async login(username, password) {
    try {
      const result = await this.post("auth/login", { username, password });
      this.setIsAuth(true);
      this.setToken(result.data.token);
      return { isAuth: true };
    } catch (error) {
      console.log(error);
      return { isAuth: false, msg: error };
    }
  }
}
const authService = new AuthService();
export default authService;
