import {
  bcrypt,
  create,
  getNumericDate,
} from "../../deps.ts";
import type {
  Header,
  Payload,
} from "../../deps.ts";
import UserRepository from "../repositories/UserRepository.ts";
import IUser from "../entities/IUser.ts";
import { TOKEN_EXPIRED, SECRET_KEY } from "../config/config.ts";

export default class AuthService {
  readonly userRepository = new UserRepository();
  constructor() {}

  async register(userInput: IUser) {
    const { password } = userInput;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = Object.assign({}, userInput, { password: hashPassword});
    const register = await this.userRepository.insertOne(user);
    return console.log("User has been created");
  };

  async login(user: IUser) {
    const result = await this.userRepository.findByEmail(user.email);
    if (!user.email) {
      console.log("Not a user");
      return { isAuth: false, token: '' };
    }
    const passwordConfirmation = await bcrypt.compare(
      user.password,
      result.password,
    );
    if (!passwordConfirmation) {
      return { isAuth: false, token: '' };
    }
    const key = SECRET_KEY;
    const payload: Payload = {
      email: user.email,
      exp: getNumericDate(new Date().getTime() + TOKEN_EXPIRED),
    };
    const header: Header = {
      alg: "HS256",
      typ: "JWT",
    };
    const token = await create(header, payload, key);
    return { isAuth: true, token: token };
  };
}
