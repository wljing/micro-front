/**
 * @description app加载器，提供app的加载、销毁能力，并执行相关的生命周期方法
 */
import JsSandBox from '../JsSandBox/index';

export type AppLoadConfig = {
  id?: string,
  url: string,
  mode: LoadMode.html,
  parent: HTMLElement,
  beforeLoad?: Function,
  beforeMounted?: Function,
  mounted?: Function,
  beforeDestory?: Function,
  destoryed?: Function,
};
enum LoadMode { js = 'script', html = 'html' };

const getDir = (path: string): string => {
  const chunks = path.split('/');
  return chunks.length === 0 ? path : chunks.slice(0, -1).join('/');
}

function uintToString(uintArray: Uint8Array) {
  const encodedString = String.fromCharCode.apply(null, uintArray);
  return decodeURIComponent(escape(encodedString));
}

export default class AppLoader {
  url: string = '';
  domain: string = '';
  htmlText: string = '';
  script: string = '';
  jsSandBox: JsSandBox;
  mode: LoadMode;
  id: string = '';
  parent: HTMLElement;

  private beforeLoad: Function;
  private beforeMounted: Function;
  private mounted: Function;
  private beforeDestory: Function;
  private destoryed: Function;

  constructor(config: AppLoadConfig) {
    this.id = config.id || `Id_${new Date().getTime().toString(16)}`;
    this.url = config.url;
    this.domain = getDir(this.url);
    this.jsSandBox = new JsSandBox();
    this.mode = config.mode;
    this.parent = config.parent || document.body;
    const defaultLifeCycleFunction = () => { };
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

  async load(cache: boolean = false) {
    this.beforeLoad();
    let data: any = this.htmlText;
    if (!cache) {
      data = await this.fetchUrlData(this.url);
      if (typeof data !== 'string') {
        console.error(`fetch ${this.url} failed`);
        return;
      }
      
      this.htmlText = data;
    }
    this.mount();
  }
  private async mount(id: string = this.id) {
    this.beforeMounted();
    if (this.mode === LoadMode.html) {
      const div = document.createElement('div');
      div.id = id;
      const srcList: Array<string> = [];
      div.innerHTML = this.htmlText;
      div.childNodes.forEach((v: any) => {
        if (v.nodeName === 'SCRIPT') {
          const src = v.getAttribute('src');
          if (src !== '') {
            srcList.push(src);
          } else {
            this.script += v.innerText;
          }
        }
        if (v.nodeName === 'META' || v.nodeName === 'TITLE') {
          div.removeChild(v);
        }
      });
      console.log('div', div);
      this.parent.appendChild(div);
      this.loadScriptList(srcList);
    } else {
      this.script = this.htmlText || '';
      this.jsSandBox.run(this.script, () => this.mounted());
    }
  }

  destory() {
    this.beforeDestory();
    const root = document.querySelector(this.id);
    root.innerHTML = '';
    this.destoryed();
  }

  private async loadScriptList(urlArray: Array<string>) {
    for (let i = 0; i < urlArray.length; i++) {
      const data = await this.fetchUrlData(this.domain + '/' + urlArray[i]);
      if (typeof data !== 'string') {
        console.error(`fetch ${this.url} failed`);
        return;
      }
      this.script += data;
    }
    this.runScript();

  }
  private fetchUrlData(url: string) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'Get',
      })
        .then(res => {
          res.text()
            .then(value => {
              resolve(value);
            })
            .catch(_ => reject());
        })
        .catch((error) => {
          console.error(error);
          reject(false);
        });
    })
  }

  runScript = () => {
    try {
      this.jsSandBox.run(this.script, () => this.mounted());
    } catch (e) {
      console.error('加载失败', e);
    }
  }
}


