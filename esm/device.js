import * as origin from 'galanga';
export function checkDeviceType(types = ['os', 'browser', 'device', 'platform']) {
    const res = uni.getSystemInfoSync();
    if (res.uniPlatform === 'web') {
        return origin.checkDeviceType(types);
    }
    else {
        //这个之后还要细微修改
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
            return deviceInfo[types];
        }
        else {
            return origin.shakeObject(deviceInfo, types);
        }
    }
}
