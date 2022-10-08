import { UserRole } from '@/enums/user.enum';

export interface ILoginDto {
  username: string;
  password: string;
}

export interface IRegisterDto {
  username: string;
  password: string;
  email: string;
  role: UserRole;
}
