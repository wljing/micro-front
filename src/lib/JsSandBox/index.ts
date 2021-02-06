interface JsSandBoxConfig {
  beforeMounted: Function
  mounted: Function
  beforeDestory: Function
  destoryed: Function
  script: string
};

type parameter = string | number | symbol;

export default class JsSandBox {
  private static JsSandBoxIndex: number = 0;
  private static PreSandBoxName = '__JS_SAND_BOX_';
  private static GlobalPropertyMap = new Map();
  
  private propertiesMap: Map<parameter, any>;
  private beforeMounted: Function;
  private mounted: Function;
  private beforeDestory: Function;
  private destoryed: Function;
  private fakerWindow: Window;
  private sandBoxName: string;

  static defineGlobalProperty(key: any, value: any) {
    JsSandBox.GlobalPropertyMap.set(key, value);
  }

  constructor(config: JsSandBoxConfig) {
    this.init(config);
  }
  private init(config: JsSandBoxConfig) {
    this.propertiesMap = new Map();
    const defaultLifeCycleFunction = () => { };
    let script = '';
    if (typeof config === 'object') {
      this.beforeMounted = config.beforeMounted || defaultLifeCycleFunction;
      this.mounted = config.mounted || defaultLifeCycleFunction;
      this.beforeDestory = config.beforeDestory || defaultLifeCycleFunction;
      this.destoryed = config.destoryed || defaultLifeCycleFunction;
      script = config.script || '';
    }
    this.initFakerWindow();
    this.mountFakerWindow();
    if (typeof script === 'string' && script.length > 0) {
      this.run(script);
    }
  }
  run(script: string, cb: Function = null) {
    const fn = new Function(`
      with(${this.sandBoxName}) {
        ${script}
      }
    `);
    fn();
    typeof cb === 'function' && cb();
  }
  private initFakerWindow() {
    const propertiesMap = this.propertiesMap;
    Object.keys(window).forEach((p: any) => {
      if (Reflect.getOwnPropertyDescriptor(window, p).configurable) {
        propertiesMap.set(p, window[p]);
      }
    });
    const self = this;
    this.fakerWindow = new Proxy(window, {
      get(target: Window, p: any) {
        if (p === 'window' || p === 'self' || p === 'top') {
          return self.fakerWindow;
        }
        return propertiesMap.has(p)
          ? propertiesMap.get(p)
          : JsSandBox.GlobalPropertyMap.has(p)
            ? JsSandBox.GlobalPropertyMap.get(p)
            : target[p];
      },
      set(target: Window, p: any, v: any) {
        if (propertiesMap.has(p)) {
          propertiesMap.set(p, v);
        } else {
          if (Object.prototype.hasOwnProperty.call(target, p)) {
            if (Reflect.getOwnPropertyDescriptor(target, p).configurable) {
              propertiesMap.set(p, v);
            } else {
              target[p] = v;
            }
          } else {
            propertiesMap.set(p, v);
          }
        }
        return true;
      },
    });
    
  }
  private mountFakerWindow() {
    const sandBoxName = `${JsSandBox.PreSandBoxName}${JsSandBox.JsSandBoxIndex++}`;
    this.sandBoxName = sandBoxName;
    const fakerWindow = this.fakerWindow;
    Reflect.defineProperty(window, sandBoxName, {
      get() {
        return fakerWindow;
      },
      set() {
        return true;
      },
      configurable: false,
      enumerable: false,
    });
  }
}