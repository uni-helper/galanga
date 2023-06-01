export declare const localCookie: {
    getItem: (sKey: string) => any;
    setItem: (sKey: string, sValue: string, vEnd?: number | string | Date, sPath?: string, sDomain?: string, bSecure?: boolean) => boolean;
    removeItem: (sKey: string, sPath?: string, sDomain?: string) => boolean;
    hasItem: (sKey: string) => boolean;
    keys: () => any[];
    clear: () => void;
};
