export default interface IBookmark {
  _id: string;
  icon: string;
  title: string;
  link: string;
  parent_id: string;
  type: BookmarkType;
  order: number;
  created_date: Date;
  updated_date: Date;
}

export type IBookmarkInput = Omit<IBookmark, '_id'>;

export enum BookmarkType {
  Folder,
  Web,
}
