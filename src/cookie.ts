import { localCookie as localCookieO } from 'galanga';

export const localCookie = {
  //#ifdef H5
  getItem: localCookieO.getItem,
  setItem: localCookieO.setItem,
  removeItem: localCookieO.removeItem,
  keys: localCookieO.keys,
  clear: localCookieO.clear,
  //#endif
  //#ifndef H5
  [Symbol.iterator]: () => false,
  //#endif
}