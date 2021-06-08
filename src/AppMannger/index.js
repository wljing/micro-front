"use strict";
exports.__esModule = true;
var JsSandBox_1 = require("../JsSandBox");
var index_1 = require("../AppLoader/index");
var Communicator_1 = require("../Communicator");
JsSandBox_1["default"].defineGlobalProperty('IPC', new Communicator_1["default"]());
var AppMannger = (function () {
    function AppMannger(config) {
        var _this = this;
        this.getAppId = function () { return "AppId_" + AppMannger.APP_INDEX++; };
        this.init = function () {
            var apps = _this.config.apps;
            apps.forEach(function (appConfig) {
                _this.add(appConfig);
            });
        };
        this.load = function (appId, parent, force) {
            if (force === void 0) { force = false; }
            if (typeof appId === 'number') {
                appId = _this.appList[appId].appId;
            }
            if (_this.appStatusMap.has(appId)) {
                var appStatus = _this.appStatusMap.get(appId);
                console.log(appStatus);
                if (!appStatus.active || force) {
                    console.log('parnet', parent, parent instanceof HTMLElement);
                    if (parent instanceof HTMLElement) {
                        appStatus.appConfig.parent = parent;
                    }
                    var loader = new index_1["default"](appStatus.appConfig);
                    loader.load();
                    appStatus.loader = loader;
                    appStatus.active = true;
                }
            }
            else {
                console.error("app is not init which appId is " + appId);
            }
        };
        this.reLoad = function (appId) {
            _this.load(appId, null, true);
        };
        this.add = function (appConfig) {
            var appStatus = {
                loader: null,
                active: false,
                appId: appConfig.id || _this.getAppId(),
                appConfig: appConfig
            };
            _this.appStatusMap.set(appStatus.appId, appStatus);
            _this.appList.push(appStatus);
        };
        this.del = function (appId) {
            _this.appList = _this.appList.filter(function (v) { return v.appId === appId; });
            _this.appStatusMap["delete"](appId);
        };
        this.config = config;
        this.appList = [];
        this.appStatusMap = new Map();
        this.init();
    }
    AppMannger.APP_INDEX = 0;
    return AppMannger;
}());
exports["default"] = AppMannger;
//# sourceMappingURL=index.js.map