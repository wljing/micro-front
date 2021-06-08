"use strict";
exports.__esModule = true;
var ChannelNode = (function () {
    function ChannelNode() {
        this.callbackList = [];
        this.childChannel = new Map();
    }
    ChannelNode.prototype.add = function (cb) {
        var result = false;
        if (typeof cb === 'function') {
            this.callbackList.push(cb);
            result = true;
        }
        return result;
    };
    ChannelNode.prototype.remove = function (cb) {
        var result = false;
        var oldIndex = this.callbackList.indexOf(cb);
        if (oldIndex > -1) {
            this.callbackList.splice(oldIndex, 1);
            result = true;
        }
        return result;
    };
    ChannelNode.prototype.addChild = function (name, child) {
        if (child === void 0) { child = new ChannelNode(); }
        if (typeof name !== 'string') {
            console.error(new TypeError('name is not a string'));
            return false;
        }
        if (!(child instanceof ChannelNode)) {
            console.error(new TypeError('child is not a ChannelNode'));
            return false;
        }
        if (this.hasChild(name)) {
            console.error(new Error('this child node has been added'));
            return false;
        }
        this.childChannel.set(name, child);
        return true;
    };
    ChannelNode.prototype.hasChild = function (name) {
        return this.childChannel.has(name);
    };
    ChannelNode.prototype.getChild = function (name) {
        return this.childChannel.get(name);
    };
    ChannelNode.prototype.run = function (payload) {
        this.callbackList.forEach(function (fn) {
            fn(payload);
        });
    };
    return ChannelNode;
}());
var Communicator = (function () {
    function Communicator() {
    }
    Communicator.prototype.on = function (channel, cb) {
        var curChannelNode = Communicator.ChannelRoot;
        if (typeof channel !== 'string') {
            console.error(new TypeError('channel is not a string'));
            return;
        }
        var channelList = channel.split(':');
        channelList.forEach(function (v) {
            if (!curChannelNode.hasChild(v)) {
                curChannelNode.addChild(v);
            }
            curChannelNode = curChannelNode.getChild(v);
        });
        curChannelNode.add(cb);
    };
    Communicator.prototype.emit = function (channel, payload) {
        if (typeof channel !== 'string') {
            console.error(new TypeError('channel is not a string'));
        }
        var channelList = channel.split(':');
        var curChannelNode = Communicator.ChannelRoot;
        var isAll = false;
        for (var i = 0; i < channelList.length; i++) {
            var item = channelList[i];
            if (item === '*') {
                isAll = true;
                break;
            }
            if (curChannelNode.hasChild(item)) {
                curChannelNode = curChannelNode.getChild(item);
            }
            else {
                curChannelNode = null;
                break;
            }
        }
        if (curChannelNode) {
            if (isAll) {
                curChannelNode.childChannel.forEach(function (node) {
                    node.run(payload);
                });
            }
            else {
                curChannelNode.run(payload);
            }
        }
    };
    Communicator.ChannelRoot = new ChannelNode();
    return Communicator;
}());
function singleMode(constructor) {
    var foo = null;
    var fn = function () {
        if (!foo) {
            foo = Object.create(constructor.prototype);
            constructor.call(foo);
        }
        return foo;
    };
    return fn;
}
exports["default"] = singleMode(Communicator);
//# sourceMappingURL=index.js.map