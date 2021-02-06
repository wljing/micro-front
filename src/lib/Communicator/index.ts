class ChannelNode {
  callbackList: Array<Function>;
  childChannel: Map<string, ChannelNode>;

  constructor() {
    this.callbackList = [];
    this.childChannel = new Map();
  }
  add(cb: Function): boolean {
    let result = false;
    if (typeof cb === 'function') {
      this.callbackList.push(cb);
      result = true;
    }
    return result;
  }
  remove(cb: Function): boolean {
    let result = false;
    const oldIndex = this.callbackList.indexOf(cb);
    if (oldIndex > -1) {
      this.callbackList.splice(oldIndex, 1);
      result = true;
    }
    return result;
  }
  addChild(name: string, child: ChannelNode = new ChannelNode()): boolean {
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
  }
  hasChild(name: string): boolean {
    return this.childChannel.has(name);
  }
  getChild(name: string): ChannelNode | undefined {
    return this.childChannel.get(name);
  }
  run(payload: any) {
    this.callbackList.forEach(fn => {
      fn(payload);
    })
  }
}

class Communicator {
  static ChannelRoot = new ChannelNode();
  on(channel: string, cb: Function) {
    let curChannelNode = Communicator.ChannelRoot;
    if (typeof channel !== 'string') {
      console.error(new TypeError('channel is not a string'));
      return;
    }
    const channelList = channel.split(':');
    channelList.forEach(v => {
      if (!curChannelNode.hasChild(v)) {
        curChannelNode.addChild(v);
      }
      curChannelNode = curChannelNode.getChild(v);
    });
    curChannelNode.add(cb);
  }
  emit(channel: string, payload: any) {
    if (typeof channel !== 'string') {
      console.error(new TypeError('channel is not a string'));
    }
    const channelList = channel.split(':');
    let curChannelNode = Communicator.ChannelRoot;
    let isAll = false;
    for (let i = 0; i < channelList.length; i++) {
      const item = channelList[i];
      if (item === '*') {
        isAll = true;
        break;
      }
      if (curChannelNode.hasChild(item)) {
        curChannelNode = curChannelNode.getChild(item);
      } else {
        curChannelNode = null;
        break;
      }
    }
    if (curChannelNode) {
      if (isAll) {
        curChannelNode.childChannel.forEach(node => {
          node.run(payload);
        })
      } else {
        curChannelNode.run(payload);
      }
    }
  }
}

function singleMode(constructor: Function): Function {
  let foo: Object = null;
  return function () {
    if (!foo) {
      foo = Object.create(constructor.prototype);
      constructor.call(foo)
    }
    return foo;
  }
}

export default singleMode(Communicator);
