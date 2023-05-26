import * as origin from 'galanga';
export function checkDeviceType(types = ['os', 'browser', 'device', 'platform']) {
    let result;
    // #ifdef H5
    result = origin.checkDeviceType(types);
    // #endif
    // #ifndef H5
    const res = uni.getSystemInfoSync();
    if (res.uniPlatform === 'web') {
        return origin.checkDeviceType(types);
    }
    else {
        const deviceInfo = {
            os: res.osName,
            browser: res.browserName,
            device: res.deviceType,
            platform: res.uniPlatform
        };
        // #ifdef MP || QUICKAPP-WEBVIEW
        if (deviceInfo.os === 'android' || deviceInfo.os === 'windows') {
            deviceInfo.browser = 'chrome';
        }
        else {
            deviceInfo.browser = 'safari';
        }
        // #endif
        if (typeof types === 'string') {
            result = deviceInfo[types];
        }
        else {
            result = origin.shakeObject(deviceInfo, types);
        }
    }
    // #endif
    return result;
}
