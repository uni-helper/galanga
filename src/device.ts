import * as origin from 'galanga'
declare const uni: any

interface DeviceInfo {
  os: string;
  browser: string;
  device: string;
  platform: string;
}

export function checkDeviceType(types: string[] | string = ['os', 'browser', 'device', 'platform']): DeviceInfo | string | object {
  const res = uni.getSystemInfoSync()
  if (res.uniPlatform === 'web') {
    return origin.checkDeviceType(types) as DeviceInfo | string | object
  } else {
    //这个之后还要细微修改
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
      return deviceInfo[types]
    } else {
      return origin.shakeObject(deviceInfo, types);
    }
  }
}

