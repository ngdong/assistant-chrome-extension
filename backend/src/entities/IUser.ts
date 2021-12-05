export default interface IUser {
  _id?: string;
  email: string;
  password: string;
}

export type IUserInput = Omit<IUser, '_id'>;
