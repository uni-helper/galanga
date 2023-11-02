/*!
 * @uni-helper/galanga 0.2.5-fix3 (https://github.com/uni-helper/galanga)
 * API https://galanga.censujiang.com/api/
 * Copyright 2014-2023 censujiang. All Rights Reserved
 * Licensed under Apache License 2.0 (https://github.com/uni-helper/galanga/blob/master/LICENSE)
 */

/*! js-cookie v3.0.5 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (name, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    name = encodeURIComponent(name)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      name + '=' + converter.write(value, name) + stringifiedAttributes)
  }

  function get (name) {
    if (typeof document === 'undefined' || (arguments.length && !name)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var found = decodeURIComponent(parts[0]);
        jar[found] = converter.read(value, found);

        if (name === found) {
          break
        }
      } catch (e) {}
    }

    return name ? jar[name] : jar
  }

  return Object.create(
    {
      set,
      get,
      remove: function (name, attributes) {
        set(
          name,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });

//操作cookie的方法
const localCookie$1 = {
    getItem: api.get,
    setItem: api.set,
    removeItem: api.remove,
    keys() {
        const aKeys = document.cookie.replace(/((?:^|\s*;)[^]+)(?=;|$)|^\s*|\s*(?:[^;]*)?(?:|$)/g, '').split(/\s*(?:[^;]*)?;\s*/);
        for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    },
    clear() {
        const keys = this.keys();
        for (let i = 0; i < keys.length; i++) {
            this.removeItem(keys[i]);
        }
    }
};

const chars62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
//一个62进制的加密函数，将十进制数字转换为62进制字符串
function encode62(num) {
    let radix = chars62.length;
    let arr = []; // specify the type of arr as string[]
    do {
        let mod = num % radix;
        num = (num - mod) / radix;
        arr.unshift(chars62[mod]);
    } while (num);
    return arr.join('');
}
//一个62进制的解密函数，将62进制字符串转换为十进制数字
function decode62(str) {
    if (typeof str == 'number') {
        str = str.toString();
    }
    let radix = chars62.length;
    let len = str.length;
    let i = 0;
    let origin = 0;
    while (i < len) {
        origin += Math.pow(radix, i++) * chars62.indexOf(str.charAt(len - i) || '0');
    }
    return Number(origin);
}
//从一个URL字符串中获取文件名
function getFileNameFromURL(url) {
    let arr = url.split('/');
    return arr[arr.length - 1];
}
//从一个字符串中获取文件后缀格式
function getFileExtFromString(str) {
    let arr = str.split('.');
    return arr[arr.length - 1];
}
//拼接一个站点的标题，会有一个json对象作为参数输入到此函数，对象中有四个属性，分别是标题（默认为none），站点名称（默认为Galanga），分隔符（默认为-），是否反转（默认为false）
function spliceSiteTitle({ title = 'none', siteName = 'Galanga', separator = '-', reverse = false } = {}) {
    separator = ' ' + separator + ' ';
    if (reverse) {
        return siteName + separator + title;
    }
    else {
        return title + separator + siteName;
    }
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
    let isString = false;
    let originTypes;
    if (typeof types === 'string') {
        isString = true;
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
    if (isString === true) {
        return result[originTypes];
    }
    else {
        return shakeObject(result, types);
    }
}
function share$1({ content = 'none', title = 'galanga', url = '', type = 'none', //仅为兼容其他平台，无实际作用
files = [], } = {}) {
    const text = title + ' ' + content + '\n' + url;
    if (!navigator.share) {
        clipboardShare();
    }
    else {
        navigatorShare();
    }
    function navigatorShare() {
        if (!navigator.canShare) {
            files = [];
        }
        else {
            if (!navigator.canShare({ files })) {
                files = [];
            }
        }
        navigator.share({
            title: title,
            text: content,
            url: url,
            files: files,
        }).catch((error) => {
            console.warn('Not support navigator share', error);
            clipboardShare();
        });
    }
    async function clipboardShare() {
        clipboardPermission$1.request();
        const r = await clipboard$1.write(text);
        if (r == true) {
            alert("已将分享内容复制到剪切板。");
        }
        else {
            promptShare();
        }
    }
    function promptShare() {
        prompt("请您复制以下内容并手动分享。", text);
    }
}

// 根据属性名去除数组中重复的对象，将 length 大的数组保留，length 小的数组去掉
function filterUniqueByProperty(array, prop) {
    return array.filter((item, index, self) => {
        const foundIndex = self.slice(index + 1).findIndex((other) => other[prop] === item[prop]);
        return foundIndex === -1;
    });
}
// 去除数组中完全相同的对象
function arrayFilterUniqueItem(array) {
    const uniqueObjects = [];
    const seenObjects = new Set();
    for (const obj of array) {
        const objString = JSON.stringify(obj);
        if (!seenObjects.has(objString)) {
            uniqueObjects.push(obj);
            seenObjects.add(objString);
        }
    }
    return uniqueObjects;
}

function formatNumber(value, decimal = 2) {
    const decimalValue = Math.pow(10, decimal);
    return (Math.floor(value * decimalValue) / decimalValue).toString();
}
//计算百分比
//输入三个参数，分别是分子，分母，保留的小数位数（默认为1）
//返回百分比字符串，例如：'50.0%'
//保留小数位数由formatNumber函数计算得到
function formatPercent(numerator = 0, denominator = 100, decimal = 1) {
    return formatNumber(numerator / denominator * 100, decimal) + '%';
}

//返回离现在多少时间后的时间
//输入参数为毫秒数或者Date类型的东西，返回值为Date类型
function afterTime(time, backType = 'Date') {
    let result;
    if (typeof time === 'number') {
        result = new Date(Date.now() + time);
    }
    else if (typeof time === 'string') {
        result = new Date(Date.now() + Number(time));
    }
    else if (time instanceof Date) {
        result = new Date(Date.now() + time.getTime());
    }
    else {
        throw new Error('输入参数类型错误');
    }
    if (backType.toLowerCase() === 'date') {
        return result;
    }
    else if (backType.toLowerCase() === 'number') {
        return result.getTime();
    }
    else if (backType.toLowerCase() === 'string') {
        return result.toISOString();
    }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const localCookie = {
    //#ifdef H5
    getItem: localCookie$1.getItem,
    setItem: localCookie$1.setItem,
    removeItem: localCookie$1.removeItem,
    keys: localCookie$1.keys,
    clear: localCookie$1.clear,
    //#endif
    //#ifndef H5
    [Symbol.iterator]: () => false,
    //#endif
};

const url = {
    getPath: (isFullPath = false) => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        if (isFullPath) {
            return currentRoute.$page.fullPath;
        }
        else {
            return '/' + currentRoute.route;
        }
    },
    getQuery: (value) => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        return currentRoute.$page.options[value];
    },
    getHash: () => {
        return undefined;
    },
    setHash: (value) => {
        return false;
    },
    setPath: (value) => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        currentRoute.$page.route = value;
    },
    setQuery: (key, value) => {
        const uniRouter = getCurrentPages();
        const currentRoute = uniRouter[uniRouter.length - 1];
        currentRoute.$page.options[key] = value;
    }
};
//获取上一页的url
function getPreURL() {
    const uniRouter = getCurrentPages();
    const prevRoute = uniRouter[uniRouter.length - 2];
    return '/' + prevRoute.route;
}

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
function share({ content = 'none', title = 'galanga', url = '', type = 'system', files = [], } = {}) {
    // #ifdef H5
    share$1({
        content,
        title,
        url,
        files,
    });
    // #endif
    // #ifdef APP-PLUS
    if (type === 'system') {
        uni.shareWithSystem({
            summary: title + ' ' + content,
            href: url,
        });
    }
    else {
        let shareInfo = {
            provider: type,
            summary: title,
            title: title,
            type: 1,
        };
        if (shareInfo.provider === 'sinaweibo') {
            shareInfo.type = 0;
        }
        if (checkNotNull(url)) {
            shareInfo.href = url;
        }
        uni.share(shareInfo);
    }
    // #endif
    // #ifndef H5 || APP-PLUS
    uni.showShareMenu({
        title: title,
        content: checkNull(url) ? content : content + '\n' + url,
    });
    // #endif
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
            //首先判断安卓13引入的新权限
            result = await requestAndroidPermission('android.permission.POST_NOTIFICATIONS');
            //不运行的时候不通知？没关系，我们再试试旧的权限，反正我们只需要知道应用到底能不能发起通知
            if (result == false) {
                const main = plus.android.runtimeMainActivity();
                let NotificationManagerCompat = plus.android.importClass("android.support.v4.app.NotificationManagerCompat");
                if (checkNull(NotificationManagerCompat)) {
                    NotificationManagerCompat = plus.android.importClass("androidx.core.app.NotificationManagerCompat");
                }
                const notificationManagerResult = NotificationManagerCompat.from(main).areNotificationsEnabled();
                if (!notificationManagerResult) {
                    result = false;
                }
                else {
                    result = true;
                }
            }
        }
        // #endif
        return result;
    },
    request: async () => {
        let result;
        // #ifdef H5
        result = await notificationPermission$1.request();
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
        // #endif
        // #ifndef H5 || APP-PLUS
        //小程序暂时没有思路去请求，暂时只做检查
        result = await notificationPermission.check().then((check) => {
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
        // #ifndef H5 || APP-PLUS
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

export { afterTime, arrayFilterUniqueItem, checkDeviceType, checkEmail, checkNotNull, checkNull, checkPassword, clipboard, clipboardPermission, decode62, encode62, filterUniqueByProperty, formatBytes, formatNumber, formatPercent, getFileExtFromString, getFileNameFromURL, getPreURL, info, localCookie, locationPermission, notificationPermission, share, sleep, spliceSiteTitle, strLength, updateObjectFromImport, url };
