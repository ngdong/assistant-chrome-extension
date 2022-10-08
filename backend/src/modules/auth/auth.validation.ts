import Joi from 'joi';
import { ILoginDto, IRegisterDto } from '@/modules/auth/auth.interface';
import { UserRole } from '@/enums/user.enum';

const register = Joi.object<IRegisterDto>({
  username: Joi.string().label('Username').max(30).required(),
  email: Joi.string().label('Email').email().required(),
  password: Joi.string().label('Password').min(6).required(),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .label('Role')
    .messages({
      'any.required': '{{#label}} is required!',
      'any.only': '{{#label}} is invalid!',
    })
    .required(),
});

const login = Joi.object<ILoginDto>({
  username: Joi.string().label('Username').max(30).required(),
  password: Joi.string().label('Password').required(),
});

export default { register, login };
