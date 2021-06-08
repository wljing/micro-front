"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var index_1 = require("../JsSandBox/index");
var LoadMode;
(function (LoadMode) {
    LoadMode["js"] = "script";
    LoadMode["html"] = "html";
})(LoadMode || (LoadMode = {}));
;
var getDir = function (path) {
    var chunks = path.split('/');
    return chunks.length === 0 ? path : chunks.slice(0, -1).join('/');
};
function uintToString(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray);
    return decodeURIComponent(escape(encodedString));
}
var AppLoader = (function () {
    function AppLoader(config) {
        var _this = this;
        this.url = '';
        this.domain = '';
        this.htmlText = '';
        this.script = '';
        this.id = '';
        this.runScript = function () {
            try {
                _this.jsSandBox.run(_this.script, function () { return _this.mounted(); });
            }
            catch (e) {
                console.error('加载失败', e);
            }
        };
        this.id = config.id || "Id_" + new Date().getTime().toString(16);
        this.url = config.url;
        this.domain = getDir(this.url);
        this.jsSandBox = new index_1["default"]();
        this.mode = config.mode;
        this.parent = config.parent || document.body;
        var defaultLifeCycleFunction = function () { };
        this.beforeLoad = config.beforeLoad || defaultLifeCycleFunction;
        this.beforeMounted = config.beforeMounted || defaultLifeCycleFunction;
        this.mounted = config.mounted || defaultLifeCycleFunction;
        this.beforeDestory = config.beforeDestory || defaultLifeCycleFunction;
        this.destoryed = config.destoryed || defaultLifeCycleFunction;
        this.beforeLoad.bind(this);
        this.beforeDestory.bind(this);
        this.beforeMounted.bind(this);
        this.destoryed.bind(this);
    }
    AppLoader.prototype.load = function (cache) {
        if (cache === void 0) { cache = false; }
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.beforeLoad();
                        data = this.htmlText;
                        if (!!cache) return [3, 2];
                        return [4, this.fetchUrlData(this.url)];
                    case 1:
                        data = _a.sent();
                        if (typeof data !== 'string') {
                            console.error("fetch " + this.url + " failed");
                            return [2];
                        }
                        this.htmlText = data;
                        _a.label = 2;
                    case 2:
                        this.mount();
                        return [2];
                }
            });
        });
    };
    AppLoader.prototype.mount = function (id) {
        if (id === void 0) { id = this.id; }
        return __awaiter(this, void 0, void 0, function () {
            var div_1, srcList_1;
            var _this = this;
            return __generator(this, function (_a) {
                this.beforeMounted();
                if (this.mode === LoadMode.html) {
                    div_1 = document.createElement('div');
                    div_1.id = id;
                    srcList_1 = [];
                    div_1.innerHTML = this.htmlText;
                    div_1.childNodes.forEach(function (v) {
                        if (v.nodeName === 'SCRIPT') {
                            var src = v.getAttribute('src');
                            if (src !== '') {
                                srcList_1.push(src);
                            }
                            else {
                                _this.script += v.innerText;
                            }
                        }
                        if (v.nodeName === 'META' || v.nodeName === 'TITLE') {
                            div_1.removeChild(v);
                        }
                    });
                    console.log('div', div_1);
                    this.parent.appendChild(div_1);
                    this.loadScriptList(srcList_1);
                }
                else {
                    this.script = this.htmlText || '';
                    this.jsSandBox.run(this.script, function () { return _this.mounted(); });
                }
                return [2];
            });
        });
    };
    AppLoader.prototype.destory = function () {
        this.beforeDestory();
        var root = document.querySelector(this.id);
        root.innerHTML = '';
        this.destoryed();
    };
    AppLoader.prototype.loadScriptList = function (urlArray) {
        return __awaiter(this, void 0, void 0, function () {
            var i, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < urlArray.length)) return [3, 4];
                        return [4, this.fetchUrlData(this.domain + '/' + urlArray[i])];
                    case 2:
                        data = _a.sent();
                        if (typeof data !== 'string') {
                            console.error("fetch " + this.url + " failed");
                            return [2];
                        }
                        this.script += data;
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3, 1];
                    case 4:
                        this.runScript();
                        return [2];
                }
            });
        });
    };
    AppLoader.prototype.fetchUrlData = function (url) {
        return new Promise(function (resolve, reject) {
            fetch(url, {
                method: 'Get'
            })
                .then(function (res) {
                res.text()
                    .then(function (value) {
                    resolve(value);
                })["catch"](function (_) { return reject(); });
            })["catch"](function (error) {
                console.error(error);
                reject(false);
            });
        });
    };
    return AppLoader;
}());
exports["default"] = AppLoader;
//# sourceMappingURL=index.js.map