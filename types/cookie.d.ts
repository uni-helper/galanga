/// <reference types="js-cookie" />
export declare const localCookie: {
    getItem: {
        (name: string): string;
        (): {
            [key: string]: string;
        };
    };
    setItem: (name: string, value: string, options?: import("js-cookie").CookieAttributes) => string;
    removeItem: (name: string, options?: import("js-cookie").CookieAttributes) => void;
    keys: () => string[];
    clear: () => void;
    [Symbol.iterator]: () => boolean;
};
