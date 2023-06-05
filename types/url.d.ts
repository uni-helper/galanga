export declare const url: {
    getPath: (isFullPath?: boolean) => string;
    getQuery: (value: string) => any;
    getHash: () => any;
    setHash: (value?: string) => boolean;
    setPath: (value: string) => void;
    setQuery: (key: string, value: string) => void;
};
export declare function getPreURL(): string;
