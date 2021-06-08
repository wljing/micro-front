/**
 * @description app加载器，提供app的加载、销毁能力，并执行相关的生命周期方法
 */
declare type AppLoadConfig = {
  id?: string;
  url: string;
  mode: LoadMode.html;
  parent: HTMLElement;
  beforeLoad?: Function;
  beforeMounted?: Function;
  mounted?: Function;
  beforeDestory?: Function;
  destoryed?: Function;
};
declare enum LoadMode {
  js = "script",
  html = "html"
}
declare class AppLoader {
  url: string;
  domain: string;
  htmlText: string;
  script: string;
  jsSandBox: JsSandBox;
  mode: LoadMode;
  id: string;
  parent: HTMLElement;
  private beforeLoad;
  private beforeMounted;
  private mounted;
  private beforeDestory;
  private destoryed;
  constructor(config: AppLoadConfig);
  load(cache?: boolean): Promise<void>;
  private mount;
  destory(): void;
  private loadScriptList;
  private fetchUrlData;
  runScript: () => void;
}

interface AppConfig extends AppLoadConfig {
}
declare type AppManngerConfig = {
  apps: Array<AppConfig>;
};
declare type AppStatus = {
  loader: AppLoader | null;
  active: boolean;
  appId: string;
  appConfig: AppConfig;
};
export default class AppMannger {
  static APP_INDEX: number;
  config: AppManngerConfig;
  private appStatusMap;
  appList: Array<AppStatus>;
  constructor(config: AppManngerConfig);
  private getAppId;
  init: () => void;
  load: (appId: string | number, force?: boolean) => void;
  reLoad: (appId: string) => void;
  add: (appStatus: AppStatus) => void;
  del: (appId: string) => void;
}

/**
 * @description 提供app间的通信能力
 */
declare class Communicator {
  private static ChannelRoot;
  on(channel: string, cb: Function): void;
  emit(channel: string, payload: any): void;
}

declare class JsSandBox {
  private static JsSandBoxIndex;
  private static PreSandBoxName;
  private static GlobalPropertyMap;
  private unConfigurableMap;
  private propertiesMap;
  private fakerWindow;
  private sandBoxName;
  isShowLog: boolean;
  static defineGlobalProperty(key: any, value: any): void;
  constructor();
  private init;
  run(script: string, cb?: Function): void;
  private initFakerWindow;
  private mountFakerWindow;
}


