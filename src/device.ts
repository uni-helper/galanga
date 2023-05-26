import * as origin from 'galanga'
declare const uni: any

interface DeviceInfo {
  os: string;
  browser: string;
  device: string;
  platform: string;
}

export function checkDeviceType(types: string[] | string = ['os', 'browser', 'device', 'platform']): DeviceInfo | string | object {
  let result: DeviceInfo | string | object
  // #ifdef H5
  result = origin.checkDeviceType(types) as DeviceInfo | string | object
  // #endif
  // #ifndef H5
  const res = uni.getSystemInfoSync()
  if (res.uniPlatform === 'web') {
    return origin.checkDeviceType(types) as DeviceInfo | string | object
  } else {
    const deviceInfo: DeviceInfo = {
      os: res.osName,
      browser: res.browserName,
      device: res.deviceType,
      platform: res.uniPlatform
    }
    // #ifdef MP || QUICKAPP-WEBVIEW
    if (deviceInfo.os === 'android' || deviceInfo.os === 'windows') {
      deviceInfo.browser = 'chrome'
    } else {
      deviceInfo.browser = 'safari'
    }
    // #endif
    if (typeof types === 'string') {
      result = deviceInfo[types]
    } else {
      result = origin.shakeObject(deviceInfo, types);
    }
  }
  // #endif
  return result
}

