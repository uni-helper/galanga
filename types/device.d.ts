export declare const clipboard: {
    read: (onlyString?: boolean) => Promise<string | ClipboardItems>;
    write: (value: any) => Promise<boolean>;
};
interface DeviceInfo {
    os: string;
    browser: string;
    device: string;
    platform: string;
}
export declare function checkDeviceType(types?: string[] | string): DeviceInfo | string | object;
type shareType = 'system' | 'qq' | 'weixin' | 'none' | 'sinaweibo';
export declare function share({ content, title, url, type, }?: {
    content?: string;
    title?: string;
    url?: string;
    type?: shareType;
}): void;
export {};
