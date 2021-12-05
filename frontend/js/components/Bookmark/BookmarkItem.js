import { BOOKMARK_TYPE } from "../../constant.js";

const BookmarkItem = (bookmark, index) => {
  const isWebLink = Number(bookmark.type) === BOOKMARK_TYPE.Web;
  const link = isWebLink ? bookmark.link : `#/${bookmark._id}`;
  const target = isWebLink ? "_blank" : "_self";
  return `
    <div draggable="true" class="item" data-type="${bookmark.type}"
      data-id="${bookmark._id}" data-order="${index}">
      <div class="icon">
        <img src="${bookmark.icon || "icons/global.svg"}" alt="Category">
      </div>
      <div class="title">
        <a class="item-title" href="${link}" target="${target}">
          ${bookmark.title}
        </a>
      </div>
      <div class="delete">
        <a class="item-title btn-delete-bookmark" data-id="${bookmark._id}">
          <img src="icons/delete.svg" alt="Delete" width="18px">
        </a>
      </div>
    </div>
    <div draggable="true" class="item drag-item" data-id="${bookmark._id}"
      data-order="${index}" data-type="${BOOKMARK_TYPE.Web}">
    </div>
  `;
};

export default BookmarkItem;
