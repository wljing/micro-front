import JsSandBox from '../JsSandBox';
import AppLoader, { AppLoadConfig } from '../AppLoader/index';
import Communicator from '../Communicator';

JsSandBox.defineGlobalProperty('IPC', new (Communicator as any)());

interface AppConfig extends AppLoadConfig {
}

type AppManngerConfig = {
  apps: Array<AppConfig>,
};

type AppStatus = {
  loader: AppLoader | null,
  active: boolean,
  appId: string,
  appConfig: AppConfig
};

export default class AppMannger {
  static APP_INDEX: number = 0;

  config: AppManngerConfig;
  private appStatusMap: Map<string, AppStatus>;
  appList: Array<AppStatus>;

  constructor(config: AppManngerConfig) {
    this.config = config;
    this.appList = [];
    this.appStatusMap = new Map();
    this.init();
  }

  private getAppId = () => `AppId_${AppMannger.APP_INDEX++}`;

  init = () => {
    const { apps } = this.config;
    apps.forEach(appConfig => {
      const appStatus: AppStatus = {
        loader: null,
        active: false,
        appId: this.getAppId(),
        appConfig,
      };
      this.appStatusMap.set(appStatus.appId, appStatus);
      this.appList.push(appStatus);
    });
  }

  load = (appId: string | number, force: boolean = false) => {
    if (typeof appId === 'number') {
      appId = this.appList[appId].appId;
    }
    if (this.appStatusMap.has(appId)) {
      const appStatus = this.appStatusMap.get(appId);
      console.log(appStatus);
      if (!appStatus.active || force) {
        const loader = new AppLoader(appStatus.appConfig);
        loader.load();
        appStatus.loader = loader;
        appStatus.active = true;
      }
    } else {
      console.error(`app is not init which appId is ${appId}`);
    }
  }

  reLoad = (appId: string) => {
    this.load(appId, true);
  }
}