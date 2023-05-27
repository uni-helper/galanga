/*!
 * @uni-helper/galanga 0.1.7-test2 (https://github.com/uni-helper/galanga)
 * API https://galanga.censujiang.com/api/
 * Copyright 2014-2023 censujiang. All Rights Reserved
 * Licensed under Apache License 2.0 (https://github.com/uni-helper/galanga/blob/master/LICENSE)
 */

//操作cookie的方法
const localCookie$1 = {
    getItem: function (sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
            return;
        }
        let sExpires = '';
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
                    break;
                case String:
                    sExpires = '; expires=' + vEnd;
                    break;
                case Date:
                    sExpires = '; expires=' + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie =
            encodeURIComponent(sKey) +
                '=' +
                encodeURIComponent(sValue) +
                sExpires +
                (sDomain ? '; domain=' + sDomain : '') +
                (sPath ? '; path=' + sPath : '') +
                (bSecure ? '; secure' : '');
    },
    removeItem: function (sKey, sPath = '/', sDomain = window.location.hostname) {
        if (!sKey || !this.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
    },
    hasItem: function (sKey) {
        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
        const aKeys = document.cookie.replace(/((?:^|\s*;)[^]+)(?=;|$)|^\s*|\s*(?:[^;]*)?(?:|$)/g, '').split(/\s*(?:[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    },
    clear: function () {
        const keys = this.keys();
        for (let i = 0; i < keys.length; i++) {
            this.removeItem(keys[i]);
        }
    }
};

// 检查输入的值是否为空
function checkNull(val) {
    if (val === null || val === undefined || val === '' || typeof val === 'number' && isNaN(val)) {
        return true;
    }
    else if (Array.isArray(val) && val.length === 0) {
        return true;
    }
    else {
        return false;
    }
}
// 检查输入的值是否非空
function checkNotNull(val) {
    return !checkNull(val);
}
//获取字符串的字节数
function strLength(str) {
    let count = 0; //初始化字节数递加变量并获取字符串参数的字符个数
    if (str) { //如果存在字符串，则执行
        const len = str.length;
        for (let i = 0; i < len; i++) { //遍历字符串，枚举每个字符
            if (str.charCodeAt(i) > 255) { //字符编码大于255，说明是双字节字符(即是中文)
                count += 2; //则累加2个
            }
            else {
                count++; //否则递加一次
            }
        }
        return count; //返回字节数
    }
    else {
        return 0; //如果参数为空，则返回0个
    }
}
//自动转换字节的单位，会有两个参数输入到此函数，分别是数量，和一个json对象，对象中有三个属性，分别是保留的小数位数（默认为1），输入的字节是哪种单位（默认为B，没有名为auto的值），输出的字节是哪种单位（默认为auto）
//首先根据输入的数量和输入的字节单位，自动转换成字节数（以B为单位）
//然后根据设置的输出的字节单位，自动转换成对应的字节单位。如果输出的字节单位为auto，则根据输入的字节单位自动转换成合适的字节单位
//最后返回转换后的字符串
function formatBytes(bytes, { decimals = 1, from = 'B', to = 'auto' } = {}) {
    //如果输入的bytes为负数的处理
    if (bytes < 0) {
        return '-' + formatBytes(-bytes, {
            decimals,
            from,
            to
        });
    }
    else if (bytes === 0) {
        return '0 B';
    }
    else {
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = from === 'auto' ? Math.floor(Math.log(bytes) / Math.log(k)) : sizes.indexOf(from);
        bytes = bytes / Math.pow(k, i);
        if (to === 'auto') {
            const j = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, j)).toFixed(dm)) + ' ' + sizes[j];
        }
        else {
            return parseFloat((bytes).toFixed(dm)) + ' ' + to;
        }
    }
}
//检查密码强度的函数，会有两个参数输入到此函数，分别是密码，和一个json对象，对象中有几个属性，分别是密码的最小长度（默认为8），密码的最大长度（默认为16），密码中必须包含的字符类型（默认为数字、大小写字母、特殊字符），密码中必须包含的字符类型的最小数量（默认为1），密码中必须包含的字符类型的最大数量（默认为3），密码中必须包含的字符类型的最小数量（默认为2），密码中必须包含的字符类型的最大数量（默认为4）
//首先根据设置的密码的最小长度和密码的最大长度，判断密码的长度是否符合要求
//然后根据设置的密码中必须包含的字符类型，判断密码中是否包含了所有的字符类型
//最后根据设置的密码中必须包含的字符类型的最小数量和密码中必须包含的字符类型的最大数量，判断密码中是否包含了所有的字符类型的最小数量和最大数量
function checkPassword(password, { minLength = 8, maxLength = 16, 
//字符类型：数字、小写字母、大写字母、特殊字符
types = ['number', 'lowercase', 'uppercase', 'special'], minTypes = 2, maxTypes = 4 } = {}) {
    //判断密码的长度是否符合要求
    if (password.length < minLength || password.length > maxLength) {
        return false;
    }
    //判断密码中是否包含了所有的字符类型
    let typesCount = 0;
    if (types.indexOf('number') > -1 && /\d/.test(password)) {
        typesCount++;
    }
    if (types.indexOf('lowercase') > -1 && /[a-z]/.test(password)) {
        typesCount++;
    }
    if (types.indexOf('uppercase') > -1 && /[A-Z]/.test(password)) {
        typesCount++;
    }
    if (types.indexOf('special') > -1 && /[~!@#$%^&*()_+`\-={}:";'<>?,.\/]/.test(password)) {
        typesCount++;
    }
    if (typesCount < minTypes || typesCount > maxTypes) {
        return false;
    }
    return true;
}
//检查是否为Email的函数，会有一个参数输入到此函数，分别是Email
function checkEmail(email) {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(email);
}

//通知权限相关
const notificationPermission$1 = {
    //判断是否有通知权限
    check: () => {
        //判断浏览器是否支持Notification
        if (!('Notification' in window)) {
            return false;
        }
        else {
            if (Notification.permission === 'granted') {
                return true;
            }
            else if (Notification.permission === 'denied') {
                return false;
            }
            else {
                return null;
            }
        }
    },
    //请求通知权限
    request: async () => {
        let check = notificationPermission$1.check();
        if (check == null) {
            const info = await Notification.requestPermission();
            if (info === 'granted') {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return check;
        }
    }
};
// 剪切板权限相关
const clipboardPermission$1 = {
    // 判断是否有剪切板权限
    check: async () => {
        // 判断浏览器是否支持Clipboard
        if (!('Clipboard' in window)) {
            return false;
        }
        else {
            // 尝试读取剪切板内容
            try {
                const permissionName = "clipboard-write";
                const info = await navigator.permissions.query({ name: permissionName });
                if (info.state === 'granted') {
                    return true;
                }
                else if (info.state === 'prompt') {
                    return null;
                }
                else {
                    return false;
                }
            }
            catch {
                return false;
            }
        }
    },
    // 请求剪切板权限
    request: async () => {
        let check = await clipboardPermission$1.check();
        if (check === null) {
            try {
                await navigator.clipboard.readText();
                return true;
            }
            catch {
                check = await clipboardPermission$1.check();
                return check === true;
            }
        }
        else {
            return check === true;
        }
    }
};
//位置权限相关
const locationPermission$1 = {
    //判断是否有位置权限
    check: async () => {
        //判断浏览器是否支持Geolocation
        if (!('geolocation' in navigator)) {
            return false;
        }
        else {
            //尝试获取位置信息
            try {
                const permissionName = "geolocation";
                const info = await navigator.permissions.query({ name: permissionName });
                if (info.state === 'granted') {
                    return true;
                }
                else if (info.state === 'prompt') {
                    return null;
                }
                else {
                    return false;
                }
            }
            catch {
                return false;
            }
        }
    },
    //请求位置权限
    request: async () => {
        let check = await locationPermission$1.check();
        if (check === null) {
            try {
                await navigator.geolocation.getCurrentPosition(() => { });
                return true;
            }
            catch {
                check = await locationPermission$1.check();
                return check === true;
            }
        }
        else {
            return check === true;
        }
    }
};

//将importObject中的值更新到object中，如果importObject中的值为空，则不更新
function updateObjectFromImport(importObject, object) {
    for (let key in object) {
        if (importObject.hasOwnProperty(key)) {
            if (typeof object[key] === 'object' && typeof importObject[key] === 'object') {
                updateObjectFromImport(importObject[key], object[key]);
            }
            else {
                //再根据是否为空来判断是否要更新
                if (checkNotNull(importObject[key])) {
                    object[key] = importObject[key];
                }
            }
        }
    }
    return object;
}
//根据输入的数组，将原有的object中的数组摇树，生成新的object
//例如有一个object为{a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:10},数组为['a','b','c','d']，则返回的object为{a:1,b:2,c:3,d:4}
function shakeObject(object, array) {
    let result = {};
    array.forEach(key => {
        if (object.hasOwnProperty(key)) {
            result[key] = object[key];
        }
    });
    return result;
}

const clipboard$1 = {
    read: async (onlyString = true) => {
        if (await clipboardPermission$1.request() == true) {
            if (onlyString) {
                const text = await navigator.clipboard.readText();
                return text;
            }
            else {
                const result = await navigator.clipboard.read();
                return result;
            }
        }
        else {
            return null;
        }
    },
    write: async (value) => {
        if (await clipboardPermission$1.request() == true) {
            try {
                if (typeof value === 'string') {
                    await navigator.clipboard.writeText(value);
                }
                else {
                    await navigator.clipboard.write(value);
                }
                return true;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        }
        else {
            return false;
        }
    }
};
function checkDeviceType$1(types = ['os', 'browser', 'device', 'platform']) {
    const ua = navigator.userAgent;
    function getOS() {
        if (/Windows/i.test(ua)) {
            return 'windows';
        }
        else if (/Macintosh/i.test(ua)) {
            return 'mac';
        }
        else if (/Linux/i.test(ua)) {
            return 'linux';
        }
        else if (/HarmonyOS/i.test(ua)) {
            return 'harmonyos';
        }
        else if (/Android/i.test(ua)) {
            return 'android';
        }
        else if (/iPhone/i.test(ua) || /iPod/i.test(ua) || /iPad/i.test(ua)) {
            return 'ios';
        }
        return 'other';
    }
    function getBrowser() {
        if (/MicroMessenger/i.test(ua)) {
            return 'wechat';
        }
        else if (/QQ/i.test(ua)) {
            return 'qq';
        }
        else if (/Alipay/i.test(ua)) {
            return 'alipay';
        }
        else if (/Weibo/i.test(ua)) {
            return 'weibo';
        }
        else if (/DingTalk/i.test(ua)) {
            return 'dingtalk';
        }
        else if (/Taobao/i.test(ua)) {
            return 'taobao';
        }
        else if (/Tmall/i.test(ua)) {
            return 'tmall';
        }
        else if (/Edge/i.test(ua)) {
            return 'edge';
        }
        else if (/Opera/i.test(ua)) {
            return 'opera';
        }
        else if (/360SE/i.test(ua)) {
            return '360';
        }
        else if (/UCBrowser/i.test(ua)) {
            return 'uc';
        }
        else if (/Baidu/i.test(ua)) {
            return 'baidu';
        }
        else if (/Chrome/i.test(ua)) {
            return 'chrome';
        }
        else if (/Safari/i.test(ua)) {
            return 'safari';
        }
        else if (/Firefox/i.test(ua)) {
            return 'firefox';
        }
        else if (/MSIE/i.test(ua)) {
            return 'ie';
        }
        return 'other';
    }
    function getDevice() {
        const deviceRegex = /(iPad).*OS\s([\d_]+)|(iPod)(.*OS\s([\d_]+))?|(iPhone\sOS)\s([\d_]+)|(Android);?[\s\/]+([\d.]+)?|(Windows\sPhone)\sOS\s([\d.]+)|(Windows\sNT)\s([\d.]+)|(Macintosh);.*Mac\sOS\sX\s([\d_]+)|(Linux)\s?([\d.]+)?/;
        const matches = ua.match(deviceRegex);
        if (matches) {
            if (matches[1] || matches[3] || matches[5]) {
                return 'tablet';
            }
            else if (matches[7] || matches[9] || matches[11]) {
                return 'mobile';
            }
            else if (matches[13] || matches[15] || matches[17]) {
                return 'pc';
            }
        }
        return 'other';
    }
    const platform = 'web';
    let originTypes;
    if (typeof types === 'string') {
        types = [types];
        originTypes = types[0];
    }
    //定义一个result对象，用于存储检测结果
    //通过检查types数组，来确定需要获取的信息，不需要的信息不获取也不存储空置（直接跳过）
    const result = {
        os: types.includes('os') ? getOS() : '',
        browser: types.includes('browser') ? getBrowser() : '',
        device: types.includes('device') ? getDevice() : '',
        platform: types.includes('platform') ? platform : '',
    };
    if (typeof types === 'string') {
        return result[originTypes];
    }
    else {
        return shakeObject(result, types);
    }
}

// 去除数组中重复的对象，将 length 大的数组保留，length 小的数组去掉
function filterUniqueByProperty(array, prop) {
    return array.filter((item, index, self) => {
        const foundIndex = self.slice(index + 1).findIndex((other) => other[prop] === item[prop]);
        return foundIndex === -1;
    });
}

function formatNumber(value, decimal = 2) {
    const decimalValue = Math.pow(10, decimal);
    return (Math.floor(value * decimalValue) / decimalValue).toString();
}

const localCookie = {
    getItem: (sKey) => {
        let result = null;
        // #ifdef H5
        result = localCookie$1.getItem(sKey);
        // #endif
        return result;
    },
    setItem: (sKey, sValue, vEnd, sPath, sDomain, bSecure) => {
        // #ifdef H5
        localCookie$1.setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure);
        // #endif
    },
    removeItem: (sKey, sPath, sDomain) => {
        // #ifdef H5
        localCookie$1.removeItem(sKey, sPath, sDomain);
        // #endif
    },
    hasItem: (sKey) => {
        let result = false;
        // #ifdef H5
        result = localCookie$1.hasItem(sKey);
        // #endif
        return result;
    },
    keys: () => {
        let result = [];
        // #ifdef H5
        result = localCookie$1.keys();
        // #endif
        return result;
    },
    clear: () => {
        // #ifdef H5
        localCookie$1.clear();
        // #endif
    }
};

const url = {
    getPath: () => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        return '/' + currentRoute.route;
    },
    getQuery: (value) => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        return currentRoute.$page.options[value];
    },
    getHash: () => {
        return undefined;
    }
};

const clipboard = {
    read: async (onlyString = true) => {
        let result;
        // #ifdef H5
        result = await clipboard$1.read(onlyString);
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
        result = await clipboard$1.write(value);
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
function checkDeviceType(types = ['os', 'browser', 'device', 'platform']) {
    let result;
    // #ifdef H5
    result = checkDeviceType$1(types);
    // #endif
    // #ifndef H5
    const res = uni.getSystemInfoSync();
    if (res.uniPlatform === 'web') {
        return checkDeviceType$1(types);
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
            result = shakeObject(deviceInfo, types);
        }
    }
    // #endif
    return result;
}

// #ifdef APP-PLUS
const isIOS = (plus.os.name == "iOS");
// #endif
// 通知权限相关
const notificationPermission = {
    check: async () => {
        let result;
        // #ifdef H5
        result = await notificationPermission$1.check();
        // #endif
        // #ifdef MP || QUICKAPP-WEBVIEW
        result = await uni.getSetting().then((res) => {
            if (res.subscriptionsSetting.mainSwitch === true) {
                return true;
            }
            else {
                return false;
            }
        }).catch(() => {
            return false;
        });
        // #endif
        // #ifdef APP-PLUS
        if (isIOS === true) {
            const UIApplication = plus.ios.import("UIApplication");
            const app = UIApplication.sharedApplication();
            let enabledTypes = 0;
            if (app.currentUserNotificationSettings) {
                const settings = app.currentUserNotificationSettings();
                enabledTypes = settings.plusGetAttribute("types");
                console.log("enabledTypes1:" + enabledTypes);
                if (enabledTypes == 0) {
                    result = false;
                }
                else {
                    result = true;
                }
                plus.ios.deleteObject(settings);
            }
            else {
                enabledTypes = app.enabledRemoteNotificationTypes();
                if (enabledTypes == 0) {
                    result = false;
                }
                else {
                    result = true;
                }
            }
            plus.ios.deleteObject(app);
            plus.ios.deleteObject(UIApplication);
        }
        else {
            result = await requestAndroidPermission('android.permission.ACCESS_NOTIFICATION_POLICY');
        }
        // #endif
        return result;
    },
};
// 剪切板权限相关
const clipboardPermission = {
    check: async () => {
        let result;
        // #ifdef H5
        result = await clipboardPermission$1.check();
        // #endif
        // #ifndef H5
        result = await uni.getClipboardData().then(() => {
            return true;
        }).catch(() => {
            return false;
        });
        // #endif
        return result;
    },
    request: async () => {
        let result;
        // #ifdef H5
        result = await clipboardPermission$1.request();
        // #endif
        // #ifndef H5
        result = await clipboardPermission.check().then((check) => {
            if (checkNull(check)) {
                return false;
            }
            return check;
        }).catch(() => {
            return false;
        });
        // #endif
        return result;
    }
};
// 位置权限相关
const locationPermission = {
    check: async () => {
        let result;
        // #ifdef H5
        result = await locationPermission$1.check();
        // #endif
        // #ifndef H5
        result = await uni.getLocation().then(() => {
            return true;
        }).catch(() => {
            return false;
        });
        // #endif
        return result;
    },
    request: async () => {
        let result;
        // #ifdef H5
        result = await locationPermission$1.request();
        // #endif
        // #ifdef MP || QUICKAPP-WEBVIEW
        result = await locationPermission.check().then((check) => {
            if (checkNull(check)) {
                return false;
            }
            return check;
        }).catch(() => {
            return false;
        });
        // #endif
        // #ifdef APP-PLUS
        if (isIOS === true) {
            const locationManger = plus.ios.import("CLLocationManager");
            const status = locationManger.authorizationStatus();
            result = (status != 2);
            plus.ios.deleteObject(locationManger);
        }
        else {
            result = await requestAndroidPermission('android.permission.ACCESS_FINE_LOCATION');
        }
        // #endif
        return result;
    }
};
// Android权限查询
async function requestAndroidPermission(permissionID) {
    return new Promise((resolve, reject) => {
        plus.android.requestPermissions([permissionID], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
        function (resultObj) {
            let result = false;
            for (var i = 0; i < resultObj.granted.length; i++) {
                //var grantedPermission = resultObj.granted[i];
                //console.log('已获取的权限：' + grantedPermission);
                result = true;
            }
            for (var i = 0; i < resultObj.deniedPresent.length; i++) {
                //var deniedPresentPermission = resultObj.deniedPresent[i];
                //console.log('拒绝本次申请的权限：' + deniedPresentPermission);
                result = false;
            }
            for (var i = 0; i < resultObj.deniedAlways.length; i++) {
                //var deniedAlwaysPermission = resultObj.deniedAlways[i];
                //console.log('永久拒绝申请的权限：' + deniedAlwaysPermission);
                result = false;
            }
            resolve(result);
            // 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
            // if (result != 1) {
            // gotoAppPermissionSetting()
            // }
        }, function (error) {
            //console.log('申请权限错误：' + error.code + " = " + error.message);
            resolve(false);
        });
    });
}

//import * as packageJson from '../package.json'
//导出自己的名字
const info = {
    name: 'galanga',
    author: 'censujiang',
    type: 'uni-app',
    //version: packageJson.version,
};

export { checkDeviceType, checkEmail, checkNotNull, checkNull, checkPassword, clipboard, clipboardPermission, filterUniqueByProperty, formatBytes, formatNumber, info, localCookie, locationPermission, notificationPermission, strLength, updateObjectFromImport, url };
