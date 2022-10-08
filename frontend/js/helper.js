import { TOKEN_KEY, BASE_API_URL } from "./constant.js";

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const render = (template, selector) => {
  const node = document.querySelector(selector);
  if (!node) return;
  node.innerHTML = template;
}


export const formatDate = (value) => {
  return '';
}
 
export const isNil = (value) => {
  if (typeof value === 'string') {
    return !value.length;
  }
  return value === null || value === undefined;
}