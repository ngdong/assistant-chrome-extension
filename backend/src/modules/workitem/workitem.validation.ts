import { WorkitemType } from '@/enums/workitem.enum';
import Joi from 'joi';
import { ICreateWorkitemDto } from '@/modules/workitem/workitem.interface';

const create = Joi.object<ICreateWorkitemDto>({
  title: Joi.string().label('Title').required(),
  description: Joi.string().label('Description').required(),
  type: Joi.string()
    .valid(...Object.values(WorkitemType))
    .label('Type')
    .messages({
      'any.required': '{{#label}} is required!',
      'any.only': '{{#label}} is invalid!',
    })
    .required(),
});

const getOne = Joi.object<{ id: number }>({
  id: Joi.number().label('Workitem Id').required(),
});

export default { create, getOne };
