import * as origin from 'galanga';
export const clipboard = {
    read: async (onlyString = true) => {
        let result;
        // #ifdef H5
        result = await origin.clipboard.read(onlyString);
        // #endif
        // #ifndef H5
        result = await uni.getClipboardData().then((res) => {
            if (onlyString && typeof res.data !== 'string') {
                return null;
            }
            return res.data;
        }).catch(() => {
            return null;
        });
        // #endif
        return result;
    },
    write: async (value) => {
        let result;
        // #ifdef H5
        result = await origin.clipboard.write(value);
        // #endif
        // #ifndef H5
        result = await uni.setClipboardData({
            data: value,
            showToast: false,
        }).then(() => {
            return true;
        }).catch(() => {
            return false;
        });
        // #endif
        return result;
    }
};
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
