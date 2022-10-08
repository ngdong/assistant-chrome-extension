export const TOKEN_KEY = "tab_token___x";
export const BASE_API_URL = "http://localhost:3000/api/v1/";
export const BOOKMARK_TYPE = Object.freeze({ Folder: 0, Web: 1 });
export const FOLDER_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA8gAAAPIBlLUtiQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEdSURBVFiF7ZexSgNBFEXPndmVKCjai2Ab1N7Or7AVQgqxsPED8g3aqY2N/+EPCIJGS2tBbNTAJjPzbEwpJuuSDbgXpru8c2B4AyMzo864WunzIJABDJ+6W85Y/7ElC9nLxg17vVC1gEb9zqmM49+KBo9Jfn+hfdGvUsDJ6E5SFLQ98RKkSgWApYnbxm7sd865P1qrSkDhoVNmD9+BNwBL5uNguGoxtaYCOw1cK7/OSsABlr8P4aPAYpp6gCVbceLwT2sYi1AKPo4kZRikUcDSdDdhIZFGsTR8nCx8FpUMKhtXJxzm4CluBBqBRqARaAT+uYBUn4C8QxKZX8yfkTZnChe43JNCfJUZKu4OTmRsz1TCc5vvXJ2p+ZzWLfAFN9Ripfk+nisAAAAASUVORK5CYII=";
export const DB_NAME = "bookmarks-extension";
export const DB_VERSION = 1;
export const TRANSACTION_NAME = {
  BOOKMARK: "bookmark",
  TODO: "todo",
  NOTE: "note"
};
export const CACHE_STORAGE_KEYS = {
  BOOKMARK_ID: "bookmark_recent_id",
  TAB_ID: "tab_recent_id"
};
export const ACTIONS = Object.freeze({
  BOOKMARK_LINK: "BookmarkLink",
  SYNC_DATA: "SyncData",
  LOADING: "LoadingIndicator",
});
export const EVENTS = Object.freeze({
  SELECTED_TAB: "SELECTED_TAB",
  TODO_CREATED: "TODO_CREARED"
});
export const TODO_STATUS = Object.freeze({
  NEW: "new",
  COMPLETED: "completed",
  PAST_DUE: "past_due"
});
