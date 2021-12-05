import { IUserInput } from './IUser.ts';

export default class User implements IUserInput {
  email!: string;
  password!: string;

  constructor(data?: any) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
  }
}
