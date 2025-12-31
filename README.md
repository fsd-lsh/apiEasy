# apiEasy
A simple development API scaffolding based on Node.js
基于Node.js的简单开发API脚手架

## 项目简介
apiEasy是一个轻量级的Node.js API开发框架，基于Koa构建，提供了简洁的路由配置、控制器管理和响应处理机制，帮助开发者快速构建RESTful API和RPC服务。

apiEasy is a lightweight Node.js API development framework built on Koa, providing simple route configuration, controller management, and response handling mechanisms to help developers quickly build RESTful APIs and RPC services.

## 特性
- ✅ 支持RESTful和RPC两种API模式
- ✅ 简洁的路由配置
- ✅ 自动响应处理
- ✅ 会话管理
- ✅ 模板引擎支持
- ✅ 静态资源服务
- ✅ 中间件支持
- ✅ 控制器缓存机制

## 快速开始

### 环境要求
- Node.js >= 14.13.0 或 >= 12.20.0（支持ES模块）
- npm 或 yarn

### 安装依赖
```shell
npm install
```

### 启动服务
```shell
npm run app
```

服务将在配置的端口上运行（默认9000），访问 http://localhost:9000 查看效果。

## 使用教程

### 1. 路由配置

在 `app/config/router.json` 中配置路由：

```json
{
    "rpc": [
        "/",
        "/rpc_demo/go/hi",
        "/rpc_demo/go/fetch_some_data"
    ],
    "restful": {
        "get": {
            "/restful_demo/go": []
        },
        "post": {
            "/restful_demo/go": []
        },
        "put": {
            "/restful_demo/go": []
        },
        "delete": {
            "/restful_demo/go": []
        }
    }
}
```

### 2. 创建控制器

在 `app/controller/` 目录下创建控制器文件：

```javascript
// app/controller/rpc_demo/go.js
import {Controller} from "../../../apiEasy/controller.js";

export class go extends Controller {
    constructor(ctx) {
        super(ctx);
    }

    hi() {
        return [{message: "Hello API Easy"}];
    }
}
```

### 3. 响应处理

控制器方法可以返回数据或调用 `this.ajax()` 方法：

```javascript
// 返回数据（自动响应）
hi() {
    return [{message: "Hello"}];
}

// 手动调用ajax方法
async fetch_data() {
    let data = await this.someAsyncMethod();
    this.ajax(1, "success", data);
}
```

### 4. 会话管理

使用 `this.session()` 方法管理会话：

```javascript
// 设置会话
this.session('user', {id: 1, name: 'admin'});

// 获取会话
let user = this.session('user');

// 删除会话
this.session('user', '');

// 获取所有会话
let allSessions = this.session();

// 清除所有会话
this.session('');
```

### 5. 视图渲染

使用 `this.view()` 方法渲染视图：

```javascript
async index() {
    await this.view('index', {title: 'API Easy', content: 'Welcome'});
}
```

### 6. 重定向

使用 `this.redirect()` 方法进行重定向：

```javascript
login() {
    // 重定向到首页
    this.redirect('/');
}
```

## 项目结构

```
apiEasy/
├── apiEasy/              # 框架核心代码
│   ├── bootstrap.js      # 启动类
│   ├── controller.js     # 基础控制器类
│   ├── funcs.js          # 工具函数
│   ├── model.js          # 基础模型类
│   └── session.js        # 会话管理
├── app/                  # 应用代码
│   ├── config/           # 配置文件
│   │   ├── database.json # 数据库配置
│   │   ├── router.json   # 路由配置
│   │   ├── session.json  # 会话配置
│   │   └── setting.json  # 应用配置
│   ├── controller/       # 控制器
│   │   ├── index.js      # 首页控制器
│   │   ├── rpc_demo/     # RPC演示
│   │   └── restful_demo/ # RESTful演示
│   ├── model/            # 模型
│   ├── static/           # 静态资源
│   ├── views/            # 视图模板
│   └── start.js          # 应用入口
├── test/                 # 测试文件
├── .gitignore            # Git忽略配置
├── LICENSE               # 许可证
├── README.md             # 项目说明
├── package-lock.json     # 依赖锁定
└── package.json          # 项目配置
```

## 配置说明

### setting.json
```json
{
    "mode": "both",        # 运行模式：restful, rpc, both
    "debug": true,          # 调试模式
    "listen": 9000,         # 监听端口
    "headers": {            # 默认响应头
        "X-Power-By": "ApiEasy"
    },
    "autoResponse": {       # 自动响应配置
        "enable": true,     # 启用自动响应
        "success": {        # 成功响应配置
            "code": 1,
            "info": "ok"
        },
        "error": {          # 错误响应配置
            "code": 0,
            "info": "fail"
        }
    }
}
```

## 性能优化

apiEasy内置了多种性能优化机制：

1. **控制器缓存**：避免重复导入控制器模块
2. **路由预编译**：提前解析路由信息，减少运行时计算
3. **优化的会话管理**：直接使用Koa会话，减少不必要的包装
4. **高效的响应处理**：简化的条件判断和对象合并

## 开发建议

1. **控制器设计**：每个控制器处理相关的业务逻辑
2. **路由命名**：使用清晰的路由命名，便于维护
3. **错误处理**：在控制器中适当处理异常
4. **日志记录**：根据需要添加日志记录
5. **测试覆盖**：为API添加单元测试

## 相关文档

- [Koa](https://www.npmjs.com/package/koa)
- [@koa/router](https://www.npmjs.com/package/@koa/router)
- [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser)
- [koa-session](https://github.com/koajs/session)
- [sequelize](https://www.npmjs.com/package/sequelize)

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！