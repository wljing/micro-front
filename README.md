## 轻量微前端框架

### 文件结构

- AppLoader App加载器
- AppManage App管理器
- Communicator 基于发布订阅的通讯器
- JsSandBox 基于Proxy的JS沙箱

### 如何使用

```javascript
const app = new AppManager({ 
  apps: [
   {
     id: 'app1',
     url: '/assets/apps/app1/index.html',
     mode: 'html',
   },
   {
    id: 'app2',
    url: '/assets/apps/app2/index.js',
    mode: 'script',
  } 
  ],
});

app.load('app1', document.querySelector(`#app1`));
```

查看[案例](https://github.com/wljing/perfom)
