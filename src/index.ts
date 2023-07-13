//import * as packageJson from '../package.json'

//导出自己的名字
export const info = {
  name: 'galanga',
  author: 'censujiang',
  type: 'uni-app',
  //version: packageJson.version,
}

//引入并导出所有原有的子模块
export { checkNull, checkNotNull, strLength, formatBytes, checkPassword, checkEmail,encode62, decode62, getFileNameFromURL, getFileExtFromString, spliceSiteTitle } from 'galanga';
export { updateObjectFromImport } from 'galanga';
export { filterUniqueByProperty } from 'galanga';
export { formatNumber } from 'galanga';
export { afterTime } from 'galanga';
export { sleep } from 'galanga';

//导出自己的子模块
export { localCookie } from './cookie';
export { url, getPreURL } from './url';
export { checkDeviceType, clipboard } from './device';
export { notificationPermission, clipboardPermission, locationPermission } from './permission';