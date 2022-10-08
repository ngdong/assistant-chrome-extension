import BookmarkItem from './BookmarkItem.js';

const BookmarkList = (bookmarks) => {
  return `
    <div class="bookmark-list">
      ${ bookmarks.map((item, index) => BookmarkItem(item, index)).join("\n") }
    </div>
  `;
};
export default BookmarkList;