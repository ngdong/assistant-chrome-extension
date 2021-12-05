import db from '../db/mongo.ts';
import IBookmark, { IBookmarkInput } from '../entities/IBookmark.ts';
import { Bson } from '../../deps.ts';

export default class BookmarkRepository {
  readonly bookmarkCollection = db.collection<IBookmark>('bookmarks');

  constructor() {}

  async find() {
    const bookmarks = await this.bookmarkCollection.find().toArray();
    return bookmarks;
  }

  async findOneById(bookmarkId: string) {
    const result = await this.bookmarkCollection.findOne({ _id: new Bson.ObjectId(bookmarkId) });
    if (!result) {
      throw new Error('Not Found');
    }
    return result;
  }

  async findByParentId(parentId: string) {
    const bookmarks = await this.bookmarkCollection
      .aggregate([{ $match: { parent_id: parentId } }, { $sort: { order: 1 } }])
      .toArray();
    return bookmarks;
  }

  async findBetweenOrder(parent_id: string, start: number, end: number) {
    const bookmarks = await this.bookmarkCollection
      .find({
        order: { $gte: start, $lte: end },
        parent_id: { $eq: parent_id },
      })
      .toArray();
    return bookmarks;
  }

  async countByParentId(parentId: string) {
    const count = await this.bookmarkCollection.count({ parent_id: parentId });
    return count || 0;
  }

  async insertOne(bookmark: IBookmarkInput) {
    const bookmarkId = await this.bookmarkCollection.insertOne(bookmark);
    return bookmarkId.toString();
  }

  async insertMany(bookmarks: IBookmarkInput[]) {
    const ids = await this.bookmarkCollection.insertMany(bookmarks);
    return ids;
  }

  async updateOne(bookmarkId: string, bookmark: IBookmarkInput) {
    const { matchedCount } = await this.bookmarkCollection.updateOne({ _id: { $oid: bookmarkId } }, { $set: bookmark });
    return matchedCount !== 0;
  }

  async updateOrder(bookmarkId: string, order: number) {
    const { matchedCount } = await this.bookmarkCollection.updateOne(
      { _id: { $oid: bookmarkId } },
      { $set: { order } },
    );
    return matchedCount !== 0;
  }

  async deleteOne(bookmarkId: string) {
    const deleteCount = await this.bookmarkCollection.deleteOne({
      _id: new Bson.ObjectId(bookmarkId),
    });
    const deleteChildCount = await this.bookmarkCollection.deleteMany({ parent_id: bookmarkId });
    return !!deleteCount;
  }
}
