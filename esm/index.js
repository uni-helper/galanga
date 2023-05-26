//import * as packageJson from '../package.json'
//导出自己的名字
export const info = {
    name: 'galanga',
    author: 'censujiang',
    platform: 'uni-app',
    //version: packageJson.version,
};
//引入并导出所有原有的子模块
export { localCookie } from 'galanga';
export { url } from 'galanga';
export { checkNull, checkNotNull, strLength, formatBytes, checkPassword, checkEmail } from 'galanga';
export { checkDeviceType, clipboard } from 'galanga';
export { updateObjectFromImport } from 'galanga';
export { filterUniqueByProperty } from 'galanga';
export { notificationPermission, clipboardPermission, locationPermission } from 'galanga';
export { formatNumber } from 'galanga';
