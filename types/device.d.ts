interface DeviceInfo {
    os: string;
    browser: string;
    device: string;
    platform: string;
}
export declare function checkDeviceType(types?: string[] | string): DeviceInfo | string | object;
export {};
