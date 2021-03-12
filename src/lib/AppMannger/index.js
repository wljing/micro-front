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
                var appStatus = {
                    loader: null,
                    active: false,
                    appId: _this.getAppId(),
                    appConfig: appConfig
                };
                _this.appStatusMap.set(appStatus.appId, appStatus);
                _this.appList.push(appStatus);
            });
        };
        this.load = function (appId, force) {
            if (force === void 0) { force = false; }
            if (typeof appId === 'number') {
                appId = _this.appList[appId].appId;
            }
            if (_this.appStatusMap.has(appId)) {
                var appStatus = _this.appStatusMap.get(appId);
                console.log(appStatus);
                if (!appStatus.active || force) {
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
            _this.load(appId, true);
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