import * as origin from 'galanga';

export const localCookie = {
  getItem:(sKey:string) => {
    let result = null;
    // #ifdef H5
    result = origin.localCookie.getItem(sKey);
    // #endif
    return result;
  },
  setItem:(sKey:string, sValue:string, vEnd?:number | string | Date, sPath?:string, sDomain?:string, bSecure?:boolean) => {
    let result = false;
    // #ifdef H5
    result= origin.localCookie.setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure);
    // #endif
    return result;
  },
  removeItem:(sKey:string, sPath?:string, sDomain?:string) => {
    let result = false;
    // #ifdef H5
    result = origin.localCookie.removeItem(sKey, sPath, sDomain);
    // #endif
    return result;
  },
  hasItem:(sKey:string) => {
    let result = false;
    // #ifdef H5
    result = origin.localCookie.hasItem(sKey);
    // #endif
    return result;
  },
  keys:() => {
    let result = [];
    // #ifdef H5
    result = origin.localCookie.keys();
    // #endif
    return result;
  },
  clear:() => {
    // #ifdef H5
    origin.localCookie.clear();
    // #endif
  }
}