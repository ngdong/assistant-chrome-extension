import { IBookmarkInput, BookmarkType } from './IBookmark.ts';

export default class BookmarkInput implements IBookmarkInput {
  icon!: string;
  title!: string;
  link!: string;
  parent_id!: string;
  type!: BookmarkType;
  order!: number;
  created_date!: Date;
  updated_date!: Date;

  constructor(data?: any) {
    if (data) {
      for (const property in data) {
        if (data.hasOwnProperty(property)) (<any>this)[property] = (<any>data)[property];
      }
    }
    this.created_date = new Date();
    this.updated_date = new Date();
  }
}
