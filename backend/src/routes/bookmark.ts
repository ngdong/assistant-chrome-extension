import { Router } from "../../deps.ts";
import authorize from "../middleware/authorize.ts";
import {
  getBookmarks,
  updateBookmark,
  deleteBookmark,
  createBookmark,
  getAllChildren,
  importListBookmark,
  sortBookmark,
} from "../controllers/bookmarkController.ts";

const router = new Router({ prefix: "/api/v1/bookmark" });

router
  .get("/bookmarks", authorize, getBookmarks)
  .get("/children/:bookmarkId", authorize, getAllChildren)
  .post("/create", authorize, createBookmark)
  .post("/import", authorize, importListBookmark)
  .patch("/update/:bookmarkId", authorize, updateBookmark)
  .delete("/delete/:bookmarkId", authorize, deleteBookmark)
  .get("/sortable/:bookmarkId/:to", authorize, sortBookmark);

router.allowedMethods();

export default router;
