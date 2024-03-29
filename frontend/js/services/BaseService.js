import { TOKEN_KEY, BASE_API_URL } from "../constant.js";
import StorageService from "./StorageService.js";

export default class BaseService {
  baseUrl = BASE_API_URL;

  prepareHeader = async () => {
    const token = await this.getToken();
    return !token
      ? {
          "Content-Type": "application/json",
        }
      : {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
  };

  get = async (uri) => {
    const headers = await this.prepareHeader();
    const options = {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: headers,
      redirect: "follow",
      referrer: "no-referrer",
    };
    const url = this.baseUrl + uri;
    try {
      const resp = await fetch(url, options);
      const { status } = resp;
      if (status === 200) {
        const result = await resp.json();
        return result;
      } else if (status === 401) {
        await chrome.storage.sync.remove([TOKEN_KEY]);
        throw new Error("Unauthorized");
      } else if (status === 403) {
        throw new Error("Forbidden");
      } else if (status !== 200 && status !== 204) {
        throw new Error("An unexpected server error occurred");
      }
    } catch (err) {
      console.log("CATCH ERR::", err);
    }
  };

  /**
   *
   * @param {*} uri
   * @param {*} body
   */
  post = async (uri, body) => {
    const headers = await this.prepareHeader();
    const options = {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: headers,
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify(body),
    };

    const url = this.baseUrl + uri;
    try {
      const result = await (
        await fetch(url, options).catch(this.handleError)
      ).json();
      return result;
    } catch (err) {
      console.log("CATCH ERR::", err);
    }
  };
  /**
   *
   * @param {*} uri
   * @param {*} body
   */
  delete = async (uri, body) => {
    const headers = await this.prepareHeader();
    const options = {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      headers: headers,
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify(body),
    };

    const url = this.baseUrl + uri;
    try {
      const result = await (
        await fetch(url, options).catch(this.handleError)
      ).json();
      return result;
    } catch (err) {
      console.log("CATCH ERR::", err);
    }
  };

  getToken = async () => {
    const token = await StorageService.getItem(TOKEN_KEY);
    return token || "";
  };

  setToken(token) {
    StorageService.setItem(TOKEN_KEY, token);
  }
}
