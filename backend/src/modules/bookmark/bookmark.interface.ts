import { BookmarkType } from '@/enums/bookmark.enum';

export interface IBookmark {
  id: number;
  icon: string;
  title: string;
  link: string;
  type: BookmarkType;
  order?: number;
  parentId?: number;
}

export type ICreateBookmarkInput = Omit<IBookmark, 'id'>;

export type ICreateBookmarkDto = Pick<IBookmark, 'id' | 'order'>;

export interface IDataImportItem {
  icon: string | undefined;
  title: string;
  link: string | undefined;
  type: BookmarkType;
  order: number;
  children?: IDataImportItem[];
}

export interface IDataImport {
  data: IDataImportItem[];
}
