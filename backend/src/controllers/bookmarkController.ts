import type { RouterContext } from '../../deps.ts';
import BookmarkService from '../services/BookmarkService.ts';
import { IBookmarkInput } from '../entities/IBookmark.ts';
import BookmarkInput from '../entities/BookmarkInput.ts';

const bookmarkService = new BookmarkService();

// @desc    Get all bookmarks
// @route   GET /api/v1/bookmark/bookmarks
export const getBookmarks = async (context: RouterContext) => {
  context.response.body = await bookmarkService.getAll();
};

// @desc    Get all bookmarks
// @route   GET /api/v1/bookmark/getAllChildren
export const getAllChildren = async (context: RouterContext) => {
  const { response, params } = context;
  const bookmarkId = (await params.bookmarkId) || 'root';
  const bookmarks = await bookmarkService.getAllChildren(bookmarkId);
  response.status = 200;
  context.response.body = bookmarks;
};

// @desc    Create new bookmark
// @route   POST /api/v1/bookmark
export const createBookmark = async (context: RouterContext) => {
  const { request, response } = context;
  if (!request.hasBody) {
    response.status = 500;
    response.body = { msg: 'Invalid bookmark data' };
    return;
  }
  const result = request.body({ type: 'json' });
  const value = await result.value; // an object of parsed JSON
  const bookmark: IBookmarkInput = new BookmarkInput(value);
  const insert = await bookmarkService.createBookmark(bookmark);
  response.status = 200;
  response.body = { msg: 'Bookmark has been created', bookmark: insert };
};

// @desc    Create new bookmark
// @route   POST /api/v1/bookmark
export const importListBookmark = async (context: RouterContext) => {
  const { request, response } = context;
  if (!request.hasBody) {
    response.status = 500;
    response.body = { msg: 'Invalid bookmark data' };
    return;
  }
  try {
    const result = request.body({ type: 'json' });
    const value = await result.value; // an object of parsed JSON
    const bookmarks: IBookmarkInput[] = value['data'].map((item: any) => new BookmarkInput(item));
    const bookmarkId = await bookmarkService.createManyBookmark(bookmarks);
    response.status = 200;
    response.body = { msg: 'Bookmark has been created', bookmarkId: bookmarkId };
  } catch (error) {
    console.log(error);
  }
};

// @desc    Update single bookmark
// @route   PUT /api/v1/bookmark
export const updateBookmark = async (context: RouterContext) => {
  const { request, response, params } = context;
  const bookmarkId = await params.bookmarkId;
  if (!request.hasBody || !bookmarkId) {
    response.status = 500;
    response.body = { msg: 'Invalid bookmark data' };
    return;
  }
  const result = request.body({ type: 'json' });
  const value = await result.value; // an object of parsed JSON
  const bookmark: IBookmarkInput = new BookmarkInput(value);
  const updateBookmark = await bookmarkService.updateBookmark(bookmarkId, bookmark);
  if (updateBookmark) {
    response.status = 200;
    response.body = {
      msg: 'Bookmark has been updated',
    };
  } else {
    response.status = 404;
    response.body = {
      msg: 'Bookmark not found',
    };
  }
};

// @desc    Delete single Bookmark
// @route   DELETE /api/v1/Bookmark
export const deleteBookmark = async (context: RouterContext) => {
  const { response, params } = context;
  const bookmarkId = await params.bookmarkId;
  if (!bookmarkId) {
    response.status = 500;
    response.body = { msg: 'Invalid bookmark data' };
    return;
  }
  const deleteBookmark = bookmarkService.deleteBookmark(bookmarkId);
  if (deleteBookmark) {
    response.status = 200;
    response.body = {
      msg: 'Bookmark has been deleted',
    };
  } else {
    response.status = 404;
    response.body = {
      msg: 'Bookmark not found',
    };
  }
};

// @desc    Sortable Bookmark
// @route   GET /api/v1/Bookmark
export const sortBookmark = async (context: RouterContext) => {
  const { response, params } = context;
  const bookmarkId = await params.bookmarkId;
  const to = await params.to;
  if (!bookmarkId || isNaN(Number(to))) {
    response.status = 500;
    response.body = { msg: 'Invalid bookmark data' };
    return;
  }
  const result = bookmarkService.sortable(bookmarkId, Number(to));
  if (result) {
    response.status = 200;
    response.body = {
      msg: 'Bookmark has been update',
    };
  } else {
    response.status = 404;
    response.body = {
      msg: 'Bookmark not found',
    };
  }
};
