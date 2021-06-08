import AppLoader, { AppLoadConfig } from '../AppLoader/index';
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
}
export {};
