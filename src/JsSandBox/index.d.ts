export default class JsSandBox {
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
