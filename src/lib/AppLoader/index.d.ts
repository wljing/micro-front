import JsSandBox from '../JsSandBox/index';
export declare type AppLoadConfig = {
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
export default class AppLoader {
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
export {};
