import * as origin from 'galanga'
declare const uni: any

export const clipboard = {
  read: async (onlyString = true) => {
    let result: string | ClipboardItems | null
    // #ifdef H5
    result = await origin.clipboard.read(onlyString)
    // #endif
    // #ifndef H5
    result = await uni.getClipboardData().then((res) => {
      if (onlyString && typeof res.data !== 'string') {
        return null
      }
      return res.data
    }).catch(() => {
      return null
    })
    // #endif
    return result
  },
  write: async (value: any) => {
    let result: boolean
    // #ifdef H5
    result = await origin.clipboard.write(value)
    // #endif
    // #ifndef H5
    result = await uni.setClipboardData({
      data: value,
      showToast: false,
    }).then(() => {
      return true
    }).catch(() => {
      return false
    })
    // #endif
    return result
  }
}

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

