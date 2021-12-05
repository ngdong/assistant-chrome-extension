import UserRepository from '../repositories/UserRepository.ts';
import { IUserInput } from '../entities/IUser.ts';

export default class UserService {
  readonly userRepository = new UserRepository();
  constructor() {}

  async getUsers() {
    return await this.userRepository.find();
  }

  async createUser(user: IUserInput) {
    return await this.userRepository.insertOne(user);
  }

  async updateUser(userId: string, user: IUserInput) {
    return await this.userRepository.updateOne(userId, user);
  }

  async deleteUser(userId: string) {
    return await this.userRepository.deleteOne(userId);
  }
}
