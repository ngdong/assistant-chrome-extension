import { BookmarkRepository } from '@/repositories/bookmark.repository';
import {
  IBookmark,
  ICreateBookmarkInput,
  IDataImportItem,
} from '@/modules/bookmark/bookmark.interface';
import { IsNull } from 'typeorm';
import { BookmarkEntity } from '@/entities/bookmark.entity';
import csvtojson from 'csvtojson';
import { Parser as CsvParser } from 'json2csv';
import { isEmpty, omit } from 'lodash';

class BookmarkService {
  bookmarkRepository: typeof BookmarkRepository;
  constructor() {
    this.bookmarkRepository = BookmarkRepository;
  }

  async getAll(): Promise<BookmarkEntity[]> {
    const result = await this.bookmarkRepository.find({
      order: {
        order: 'DESC',
      },
    });
    return result;
  }

  async getOne(objId: number) {
    const item = await this.bookmarkRepository.findOne({
      where: {
        id: objId,
      },
    });
    if (!item) {
      throw new Error('Not found');
    }
    return item;
  }

  async getChildren(parentId: number | undefined): Promise<BookmarkEntity[]> {
    const result = await this.bookmarkRepository.find({
      where: {
        parent: {
          id: Number(parentId) || IsNull(),
        },
      },
      order: {
        order: 'ASC',
      },
    });
    return result;
  }

  async create(
    bookmark: ICreateBookmarkInput,
  ): Promise<Partial<BookmarkEntity> | Error> {
    const { parentId } = bookmark;
    const count = await this.bookmarkRepository.countBy({
      parentId: Number(parentId) || IsNull(),
    });
    bookmark.order = count;
    try {
      const result = await this.bookmarkRepository.insert(bookmark);
      const createdBookmark = result.generatedMaps[0];
      return { ...bookmark, ...createdBookmark };
    } catch (error) {
      throw new Error('Failed to bookmark');
    }
  }

  async update(bookmark: IBookmark): Promise<void | Error> {
    try {
      const { id } = bookmark;
      await this.bookmarkRepository.update(id, bookmark);
    } catch (error) {
      throw new Error('Failed to bookmark');
    }
  }

  async delete(bookmarkId: number): Promise<boolean | Error> {
    const result = await this.bookmarkRepository.delete(bookmarkId);
    if (!result.affected) {
      throw new Error('Failed to delete bookmark');
    }
    return !!result.affected;
  }

  async sortable(bookmarkId: number, to: number): Promise<BookmarkEntity> {
    const bookmark = await this.bookmarkRepository.findOneBy({
      id: Number(bookmarkId),
    });
    if (!bookmark) {
      throw new Error('Not found');
    }
    const { order: from, parentId } = bookmark;
    let start: number;
    let end: number;
    let temp: number;
    if (from < to) {
      start = from + 1;
      end = to;
      temp = -1;
    } else {
      start = to;
      end = from - 1;
      temp = +1;
    }
    const bookmarks = await this.getChildren(parentId);
    bookmarks.forEach(async (item: BookmarkEntity) => {
      let order = item.order;
      if (item.id === bookmarkId) {
        order = to;
      } else if (start <= +item.order && +item.order <= end) {
        order = item.order + temp;
      }
      await this.bookmarkRepository.update(item.id, {
        order,
      });
    });
    bookmark.order = Number(to);
    return bookmark;
  }

  async exportData(): Promise<string> {
    const result = await this.getAll();
    const bookmarkTree = this.buildBookmarkTree(result, undefined);
    const bookmarkFields: Array<keyof IDataImportItem> = [
      'icon',
      'title',
      'link',
      'type',
      'order',
    ];
    const csvFields = await this.buildCsvHeader(
      bookmarkTree,
      new Set([]),
      bookmarkFields,
    );
    const csvHeaderFields = this.sortCsvFields(csvFields);
    const csvParser = new CsvParser({
      fields: csvHeaderFields,
    });
    return csvParser.parse(bookmarkTree);
  }

  async importData(filePath: string): Promise<void> {
    const data = await csvtojson().fromFile(filePath);
    await this.insertTree(data);
  }

  private async insertTree(children: IDataImportItem[], parentId?: number) {
    for (const item of children) {
      const isValid = Object.values(omit(item, ['children'])).some(
        (item) => !isEmpty(item),
      );
      if (isValid) {
        const data = BookmarkEntity.fromImportItem({
          ...item,
          parentId: parentId,
        });
        const insert = await this.bookmarkRepository.insert(data);
        if (insert.generatedMaps.length && item.children) {
          const parentId = insert.generatedMaps[0].id;
          await this.insertTree(item.children, parentId);
        }
      }
    }
  }

  private buildBookmarkTree(
    bookmarks: BookmarkEntity[],
    parentId: number | undefined,
  ): IDataImportItem[] {
    const output: IDataImportItem[] = [];
    for (const obj of bookmarks) {
      const item = obj.toExportItem();
      if (obj.parentId == parentId) {
        const children = this.buildBookmarkTree(bookmarks, obj.id);
        if (children.length) {
          item.children = children;
        }
        output.push(item);
      }
    }
    return output;
  }

  private async buildCsvHeader(
    children: IDataImportItem[],
    fields: Set<string>,
    bookmarkFields: string[],
    path?: string,
  ): Promise<Set<string>> {
    for (let i = 0; i < children.length; i++) {
      const item = children[i];
      bookmarkFields.forEach((fieldName) => {
        const key = path ? `${path}.${i}.${fieldName}` : `${fieldName}`;
        fields.add(key);
      });
      if (item.children && item.children?.length) {
        const childrenPath = path ? `${path}.${i}.children` : `children`;
        await this.buildCsvHeader(
          item.children,
          fields,
          bookmarkFields,
          childrenPath,
        );
      }
    }
    return fields;
  }

  private sortCsvFields(csvFields: Set<string>) {
    return Array.from(csvFields).sort((a, b) => {
      const arr_a = a.split('.');
      const arr_b = b.split('.');
      if (arr_a.length === 1 || arr_b.length === 1) {
        return 0;
      }
      return Number(arr_a[1]) - Number(arr_b[1]);
    });
  }
}

export default BookmarkService;
