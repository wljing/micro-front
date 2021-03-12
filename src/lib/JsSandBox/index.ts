type parameter = string | number | symbol;

// 需要绑定window对象的方法
const windoFunMap = new Map([
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

export default class JsSandBox {
  private static JsSandBoxIndex: number = 0;
  private static PreSandBoxName = '__JS_SAND_BOX_';
  private static GlobalPropertyMap = new Map();

  private unConfigurableMap: Map<parameter, any>;
  private propertiesMap: Map<parameter, any>;
  private fakerWindow: Window;
  private sandBoxName: string;
  isShowLog: boolean = false;

  static defineGlobalProperty(key: any, value: any) {
    JsSandBox.GlobalPropertyMap.set(key, value);
  }

  constructor() {
    this.init();
  }
  private init() {
    this.propertiesMap = new Map();
    this.unConfigurableMap = new Map();
    this.initFakerWindow();
    this.mountFakerWindow();
  }
  run(script: string, cb: Function = () => {}) {
    console.log(script);
    const fn = new Function(`
      with(window['${this.sandBoxName}']) {
        ${script}
      }
    `);
    fn();    
  }

  // 初始化沙箱
  private initFakerWindow() {
    const unConfigurableMap = this.unConfigurableMap;
    const descs = Object.getOwnPropertyDescriptors(window);
    Object.keys(descs).forEach((p: any) => {
      if (!Reflect.getOwnPropertyDescriptor(window, p).configurable) {
        unConfigurableMap.set(p, window[p]);
      }
    });
    const self = this;
    const unscopables = {
      undefined: true,
      Array: true,
      Object: true,
      String: true,
      Boolean: true,
      Math: true,
      Number: true,
      Symbol: true,
      parseFloat: true,
      Float32Array: true,
    };
    this.fakerWindow = new Proxy(window, {
      get(target: Window, p: any) {
        let result: any = null;
        let log = '';
        if (p === 'window' || p === 'self' || p === 'top' || p === 'parent') {
          result = self.fakerWindow;
          log = 'global';
        } else if (p === Symbol.unscopables) {
          result = unscopables;
          log = 'unscopables';
        } else if (unConfigurableMap.has(p)) {
          // 不可配置的属性
          result = window[p];
          log = 'unconfig';
        } else if (JsSandBox.GlobalPropertyMap.has(p)) {
          // 全局属性
          log = 'global';
          result = JsSandBox.GlobalPropertyMap.get(p);
        } else if (self.propertiesMap.has(p)) {
          // 沙箱定义属性
          log = 'sendbox';
          result = self.propertiesMap.get(p);
        } else {
          // window 自身属性
          log = 'window';
          result = window[p];
          if (windoFunMap.has(p)) {
            result = result.bind(window);
          }
          // if (typeof result === 'function' && p !== 'Function' && p !== 'Promise' && p !== 'Date') {
          //   index = 2;
          //   result = result.bind(window);
          // }
        }
        if (self.isShowLog) {
          console.log('get', p, result, log);
        }
        return result;
      },
      set(target: Window, p: any, v: any) {
        let log = '';
        if (self.unConfigurableMap.has(p)) {
          // 不可配置属性
          log = 'unconfig';
          return false;
        } else if (JsSandBox.GlobalPropertyMap.has(p)) {
          // 全局属性
          JsSandBox.GlobalPropertyMap.set(p, v);
          log = 'global';
        } else {
          // 沙箱定义属性
          log = 'sendbox';
          self.propertiesMap.set(p, v);
        }
        if (self.isShowLog) {
          console.log('set', p, v, log);
        }
        return true;
      },
    });
  }

  // 将沙箱挂载到window
  private mountFakerWindow() {
    const sandBoxName = `${JsSandBox.PreSandBoxName}${JsSandBox.JsSandBoxIndex++}`;
    this.sandBoxName = sandBoxName;
    const fakerWindow = this.fakerWindow;
    Reflect.defineProperty(window, sandBoxName, {
      value: fakerWindow,
      configurable: false,
      enumerable: false,
      writable: false,
    });
  }
}