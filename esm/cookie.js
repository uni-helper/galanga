import * as origin from 'galanga';
export const localCookie = {
    getItem: (sKey) => {
        let result = null;
        // #ifdef H5
        result = origin.localCookie.getItem(sKey);
        // #endif
        return result;
    },
    setItem: (sKey, sValue, vEnd, sPath, sDomain, bSecure) => {
        let result = false;
        // #ifdef H5
        result = origin.localCookie.setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure);
        // #endif
        return result;
    },
    removeItem: (sKey, sPath, sDomain) => {
        let result = false;
        // #ifdef H5
        result = origin.localCookie.removeItem(sKey, sPath, sDomain);
        // #endif
        return result;
    },
    hasItem: (sKey) => {
        let result = false;
        // #ifdef H5
        result = origin.localCookie.hasItem(sKey);
        // #endif
        return result;
    },
    keys: () => {
        let result = [];
        // #ifdef H5
        result = origin.localCookie.keys();
        // #endif
        return result;
    },
    clear: () => {
        // #ifdef H5
        origin.localCookie.clear();
        // #endif
    }
};
