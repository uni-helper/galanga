import * as origin from 'galanga';
// #ifdef APP-PLUS
const isIOS = (plus.os.name == "iOS");
// #endif
// 通知权限相关
export const notificationPermission = {
    check: async () => {
        let result;
        // #ifdef H5
        result = await origin.notificationPermission.check();
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
    request: async () => {
        let result;
        // #ifdef H5
        result = await origin.notificationPermission.request();
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
        // #ifndef H5 || APP-PLUS
        //小程序暂时没有思路去请求，暂时只做检查
        result = await notificationPermission.check().then((check) => {
            if (origin.checkNull(check)) {
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
export const clipboardPermission = {
    check: async () => {
        let result;
        // #ifdef H5
        result = await origin.clipboardPermission.check();
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
        result = await origin.clipboardPermission.request();
        // #endif
        // #ifndef H5
        result = await clipboardPermission.check().then((check) => {
            if (origin.checkNull(check)) {
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
export const locationPermission = {
    check: async () => {
        let result;
        // #ifdef H5
        result = await origin.locationPermission.check();
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
        result = await origin.locationPermission.request();
        // #endif
        // #ifdef MP || QUICKAPP-WEBVIEW
        result = await locationPermission.check().then((check) => {
            if (origin.checkNull(check)) {
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
