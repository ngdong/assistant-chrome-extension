import { BookmarkType } from '@/enums/bookmark.enum';
import Joi from 'joi';
import {
  IBookmark,
  ICreateBookmarkInput,
} from '@/modules/bookmark/bookmark.interface';

const getChildren = Joi.object<{ parentId?: number }>({
  parentId: Joi.number().allow(null).label('Parent Id'),
});

const create = Joi.object<ICreateBookmarkInput>({
  icon: Joi.string().label('Icon'),
  title: Joi.string().label('Title').required(),
  link: Joi.string().label('Link').required(),
  type: Joi.string()
    .valid(...Object.values(BookmarkType))
    .label('Type')
    .messages({
      'any.required': '{{#label}} is required!',
      'any.only': '{{#label}} is invalid!',
    })
    .required(),
  order: Joi.number().label('Order'),
  parentId: Joi.number().label('Parent Id'),
});

const sort = Joi.object<{ bookmarkId: number; to: number }>({
  bookmarkId: Joi.number().label('Bookmark Id').required(),
  to: Joi.number().label('Order').required(),
});

const update = Joi.object<IBookmark>({
  id: Joi.number().label('Bookmark Id').required(),
  icon: Joi.string().label('Icon'),
  title: Joi.string().label('Title').required(),
  link: Joi.string().label('Link').required(),
  type: Joi.string()
    .valid(...Object.values(BookmarkType))
    .label('Type')
    .messages({
      'any.required': '{{#label}} is required!',
      'any.only': '{{#label}} is invalid!',
    })
    .required(),
  order: Joi.number().label('Order'),
  parentId: Joi.number().label('Parent Id'),
});

const entityId = Joi.object<{ id: number }>({
  id: Joi.number().label('Bookmark Id').required(),
});

export default {
  getChildren,
  create,
  sort,
  update,
  entityId,
};
