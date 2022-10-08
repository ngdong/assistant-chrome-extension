import IndexedDB from "./lib/IndexedDB.js";
import BookmarkService from "./services/BookmarkService.js";
import { ACTIONS } from "./constant.js";

// create alarm for watchdog and fresh on installed/updated, and start fetch data
chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled....");
  scheduleRequest();
  startRequest();
});

// fetch and save data when chrome restarted, alarm will continue running when chrome is restarted
chrome.runtime.onStartup.addListener(() => {
  console.log("onStartup....");
  startRequest();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm && alarm.name === "refresh") {
    // if refresh alarm triggered, start a new request
    startRequest();
  }
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const { action, data } = request;
  setIsLoading(true);
  const bookmarkService = new BookmarkService();
  if (action == ACTIONS.BOOKMARK_LINK) {
    console.log("bookmark Link...", request);
    bookmarkService
      .createBookmark(data)
      .then(() => handleSuccess(sendResponse))
      .catch((e) => handleError(e, sendResponse));
  } else if (action == ACTIONS.SYNC_DATA) {
    console.log("sync Data...", request);
    bookmarkService
      .syncData()
      .then(() => handleSuccess(sendResponse))
      .catch((e) => handleError(e, sendResponse));
  }
  return true; // Required to keep message port open
});

function handleSuccess(sendResponse) {
  setIsLoading(false);
  sendResponse({ data: "done" });
}

function handleError(e, sendResponse) {
  console.log("Error:", e);
  setIsLoading(false);
  sendResponse({ data: "done" });
}

// schedule a new fetch every 30 minutes
function scheduleRequest() {
  console.log("schedule refresh alarm to ...");
  chrome.alarms.create("refresh", { periodInMinutes: 120 });
}

// fetch data and save to indexedDB
async function startRequest() {
  console.log("start HTTP Request...");
  setIsLoading(true);
  await IndexedDB.connectDB();
  const bookmarkService = new BookmarkService();
  await bookmarkService.syncData();
  setIsLoading(false);
}

function setIsLoading(isLoading) {
  chrome.runtime.sendMessage({ action: ACTIONS.LOADING, data: isLoading });
}
