import {
  clipboard as clipboardO,
  checkDeviceType as checkDeviceTypeO,
  checkNotNull,
  checkNull,
  share as shareO,
  shakeObject
} from 'galanga'
declare const uni: any

export const clipboard = {
  read: async (onlyString = true) => {
    let result: string | ClipboardItems | null
    // #ifdef H5
    result = await clipboardO.read(onlyString)
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
    result = await clipboardO.write(value)
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
  result = checkDeviceTypeO(types) as DeviceInfo | string | object
  // #endif
  // #ifndef H5
  const res = uni.getSystemInfoSync()
  if (res.uniPlatform === 'web') {
    return checkDeviceTypeO(types) as DeviceInfo | string | object
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
      result = shakeObject(deviceInfo, types);
    }
  }
  // #endif
  return result
}

type shareType = 'system' | 'qq' | 'weixin' | 'none' | 'sinaweibo'

interface ShareInfoAPP {
  provider: shareType;
  summary: string;
  title: string;
  href?: string;
  type: number;
}

export function share({
  content = 'none',
  title = 'galanga',
  url = '',
  type = 'system' as shareType,
  files = [] as File[],
} = {}) {
  // #ifdef H5
  shareO({
    content,
    title,
    url,
    files,
  })
  // #endif
  // #ifndef APP-PLUS
  if (type === 'system') {
    uni.shareWithSystem({
      summary: title + ' ' + content,
      href: url,
    })
  } else {
    let shareInfo: ShareInfoAPP = {
      provider: type,
      summary: title,
      title: title,
      type: 1,
    }
    if (shareInfo.provider === 'sinaweibo') {
      shareInfo.type = 0
    }
    if (checkNotNull(url)) {
      shareInfo.href = url
    }
    uni.share(shareInfo)
  }
  // #endif
  // #ifndef H5 || APP-PLUS
  uni.showShareMenu({
    title: title,
    content: checkNull(url) ? content : content + '\n' + url,
  })
  // #endif
}