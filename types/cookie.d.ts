export declare const localCookie: {
    getItem: (sKey: string) => any;
    setItem: (sKey: string, sValue: string, vEnd?: number | string | Date, sPath?: string, sDomain?: string, bSecure?: boolean) => void;
    removeItem: (sKey: string, sPath?: string, sDomain?: string) => void;
    hasItem: (sKey: string) => boolean;
    keys: () => any[];
    clear: () => void;
};
