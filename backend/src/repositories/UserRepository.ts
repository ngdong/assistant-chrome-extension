import db from '../db/mongo.ts';
import IUser, { IUserInput } from '../entities/IUser.ts';
import User from '../entities/User.ts';

export default class UserRepository {
  readonly userCollection = db.collection<IUser>('users');
  constructor() {}

  async find() {
    const users = await this.userCollection.find().toArray();
    return users;
  }

  async findByEmail(email: string): Promise<IUser> {
    try {
      const user = await this.userCollection.findOne({ email: email });
      return user ? user : new User();
    } catch (error) {
      console.log(error);
    }
    return new User();
  }

  async insertOne(user: IUserInput) {
    try {
      const { $oid } = await this.userCollection.insertOne(user);
      return $oid;
    } catch (error) {
      console.log(error);
    }
  }

  async updateOne(userId: string, user: IUserInput) {
    const { matchedCount } = await this.userCollection.updateOne({ _id: { $oid: userId } }, { $set: user });
    return matchedCount !== 0;
  }

  async deleteOne(userId: string) {
    const isUserDelete = this.userCollection.deleteOne({
      _id: { $oid: userId },
    });
    return isUserDelete;
  }
}
