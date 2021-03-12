"use strict";
exports.__esModule = true;
var windoFunMap = new Map([
    ['alert', true],
    ['atob', true],
    ['blur', true],
    ['btoa', true],
    ['cancelAnimateFrame', true],
    ['cancelIdleCallback', true],
    ['captrueEvents', true],
    ['clearInterval', true],
    ['clearTimeout', true],
    ['close', true],
    ['confirm', true],
    ['fetch', true],
    ['find', true],
    ['focus', true],
    ['getAttention', true],
    ['getComputedStyle', true],
    ['getDefaultComputedStyle', true],
    ['getSelection', true],
    ['setTimeout', true],
    ['setInterval', true],
    ['addEventListener', true],
    ['postMessage', true],
]);
var JsSandBox = (function () {
    function JsSandBox() {
        this.isShowLog = false;
        this.init();
    }
    JsSandBox.defineGlobalProperty = function (key, value) {
        JsSandBox.GlobalPropertyMap.set(key, value);
    };
    JsSandBox.prototype.init = function () {
        this.propertiesMap = new Map();
        this.unConfigurableMap = new Map();
        this.initFakerWindow();
        this.mountFakerWindow();
    };
    JsSandBox.prototype.run = function (script, cb) {
        if (cb === void 0) { cb = function () { }; }
        console.log(script);
        var fn = new Function("\n      with(window['" + this.sandBoxName + "']) {\n        " + script + "\n      }\n    ");
        fn();
    };
    JsSandBox.prototype.initFakerWindow = function () {
        var unConfigurableMap = this.unConfigurableMap;
        var descs = Object.getOwnPropertyDescriptors(window);
        Object.keys(descs).forEach(function (p) {
            if (!Reflect.getOwnPropertyDescriptor(window, p).configurable) {
                unConfigurableMap.set(p, window[p]);
            }
        });
        var self = this;
        var unscopables = {
            undefined: true,
            Array: true,
            Object: true,
            String: true,
            Boolean: true,
            Math: true,
            Number: true,
            Symbol: true,
            parseFloat: true,
            Float32Array: true
        };
        this.fakerWindow = new Proxy(window, {
            get: function (target, p) {
                var result = null;
                var log = '';
                if (p === 'window' || p === 'self' || p === 'top' || p === 'parent') {
                    result = self.fakerWindow;
                    log = 'global';
                }
                else if (p === Symbol.unscopables) {
                    result = unscopables;
                    log = 'unscopables';
                }
                else if (unConfigurableMap.has(p)) {
                    result = window[p];
                    log = 'unconfig';
                }
                else if (JsSandBox.GlobalPropertyMap.has(p)) {
                    log = 'global';
                    result = JsSandBox.GlobalPropertyMap.get(p);
                }
                else if (self.propertiesMap.has(p)) {
                    log = 'sendbox';
                    result = self.propertiesMap.get(p);
                }
                else {
                    log = 'window';
                    result = window[p];
                    if (windoFunMap.has(p)) {
                        result = result.bind(window);
                    }
                }
                if (self.isShowLog) {
                    console.log('get', p, result, log);
                }
                return result;
            },
            set: function (target, p, v) {
                var log = '';
                if (self.unConfigurableMap.has(p)) {
                    log = 'unconfig';
                    return false;
                }
                else if (JsSandBox.GlobalPropertyMap.has(p)) {
                    JsSandBox.GlobalPropertyMap.set(p, v);
                    log = 'global';
                }
                else {
                    log = 'sendbox';
                    self.propertiesMap.set(p, v);
                }
                if (self.isShowLog) {
                    console.log('set', p, v, log);
                }
                return true;
            }
        });
    };
    JsSandBox.prototype.mountFakerWindow = function () {
        var sandBoxName = "" + JsSandBox.PreSandBoxName + JsSandBox.JsSandBoxIndex++;
        this.sandBoxName = sandBoxName;
        var fakerWindow = this.fakerWindow;
        Reflect.defineProperty(window, sandBoxName, {
            value: fakerWindow,
            configurable: false,
            enumerable: false,
            writable: false
        });
    };
    JsSandBox.JsSandBoxIndex = 0;
    JsSandBox.PreSandBoxName = '__JS_SAND_BOX_';
    JsSandBox.GlobalPropertyMap = new Map();
    return JsSandBox;
}());
exports["default"] = JsSandBox;
//# sourceMappingURL=index.js.map