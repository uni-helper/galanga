//import * as packageJson from '../package.json'
//导出自己的名字
export const info = {
    name: 'galanga',
    author: 'censujiang',
    type: 'uni-app',
    //version: packageJson.version,
};
//引入并导出所有原有的子模块
export { checkNull, checkNotNull, strLength, formatBytes, checkPassword, checkEmail } from 'galanga';
export { updateObjectFromImport } from 'galanga';
export { filterUniqueByProperty } from 'galanga';
export { formatNumber } from 'galanga';
export { afterTime } from 'galanga';
//导出自己的子模块
export { localCookie } from './cookie';
export { url } from './url';
export { checkDeviceType, clipboard } from './device';
export { notificationPermission, clipboardPermission, locationPermission } from './permission';
