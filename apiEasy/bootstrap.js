import Koa from "koa";
import Router from "@koa/router";
import Views from "koa-views";
import Static from "koa-static";
import Session from "koa-session";
import BodyParser from "koa-bodyparser";
import func from "./funcs.js";

const app = new Koa();
const router = new Router();

export class Bootstrap {

    constructor(projectFlag) {
        this.projectFlag = projectFlag;
        this.routerCnf = global.routerCnf;
        this.settingCnf = global.settingCnf;
        this.sessionCnf = global.sessionCnf;
        this.controllerCache = new Map();
        this.routeCache = new Map();
        app.use(BodyParser());
        app.use(Session(this.sessionCnf, app));
        app.use(Views(`${global.apiEasyRoot}/${this.projectFlag}/views/`, {extension: 'ejs'}));
        app.use(Static(`${global.apiEasyRoot}/${this.projectFlag}/static/`));
    }

    async getController(controllerPath) {
        if (this.controllerCache.has(controllerPath)) {
            return this.controllerCache.get(controllerPath);
        }
        const controller = await import(`../${this.projectFlag}/controller${controllerPath}.js`);
        this.controllerCache.set(controllerPath, controller);
        return controller;
    }

    precompileRoute(routePath, method = 'all') {
        if (routePath === '/') {
            return {
                controllerPath: '/index',
                className: 'index',
                funcName: 'index'
            };
        }
        const normalizedPath = routePath.replace(/\/$/, '');
        const segments = normalizedPath.split('/').filter(Boolean);
        
        let controllerPath, className, funcName;
        if (segments.length === 3) {
            controllerPath = `/${segments[0]}/${segments[1]}`;
            className = segments[1];
            funcName = method === 'all' ? segments[2] : method;
        } else if (segments.length === 2) {
            controllerPath = `/${segments[0]}/${segments[1]}`;
            className = segments[1];
            funcName = method === 'all' ? 'index' : method;
        } else if (segments.length === 1) {
            controllerPath = `/${segments[0]}`;
            className = segments[0];
            funcName = method === 'all' ? 'index' : method;
        } else {
            return {
                controllerPath: '/index',
                className: 'index',
                funcName: 'index'
            };
        }
        
        return {
            controllerPath,
            className,
            funcName
        };
    }

    rpc(both) {
        this.settingCnf.mode = both ? 'rpc' : this.settingCnf.mode;
        for (let routePath of this.routerCnf[this.settingCnf.mode]) {
            const routeInfo = this.precompileRoute(routePath);
            router.all(routePath, async (ctx, next) => {
                await ctx.set(this.settingCnf.headers);
                const { controllerPath, className, funcName } = routeInfo;
                const controller = await this.getController(controllerPath);
                const controllerInstance = new controller[className](ctx);
                const data = await controllerInstance[funcName](this.paramsFormat(ctx));
                this.autoResponse(ctx, data, controllerInstance.startTime);
            });
        }
        if(!both) {
            this.run();
        }
    }

    restful(both) {
        this.settingCnf.mode = both ? 'restful' : this.settingCnf.mode;
        for (let method in this.routerCnf[this.settingCnf.mode]) {
            for (let routePath in this.routerCnf[this.settingCnf.mode][method]) {
                const routeInfo = this.precompileRoute(routePath, method);
                router[method](routePath, async (ctx, next) => {
                    await ctx.set(this.settingCnf.headers);
                    const { controllerPath, className, funcName } = routeInfo;
                    const controller = await this.getController(controllerPath);
                    const controllerInstance = new controller[className](ctx);
                    const data = await controllerInstance[funcName](this.paramsFormat(ctx));
                    this.autoResponse(ctx, data, controllerInstance.startTime);
                });
            }
        }
        if(!both) {
            this.run();
        }
    }

    both() {
        this.rpc(true);
        this.restful(true);
        this.run();
    }

    paramsFormat(ctx) {
        return {
            query: ctx.request.query,
            body: ctx.request.body,
            merge: Object.assign(ctx.request.query, ctx.request.body),
        }
    }

    autoResponse(ctx, data, startTime) {
        if(data && this.settingCnf.autoResponse.enable) {
            const hasContent = typeof data !== 'object' ? true : Array.isArray(data) ? data.length : Object.keys(data).length;
            func.ajax(ctx, hasContent ? this.settingCnf.autoResponse.success.code : this.settingCnf.autoResponse.error.code, hasContent ? this.settingCnf.autoResponse.success.info : this.settingCnf.autoResponse.error.info, hasContent ? data : undefined, startTime);
        }
    }

    run() {
        app.keys = ['apiEasy'];
        app.use(router.routes())
            .use(router.allowedMethods());
        app.listen(this.settingCnf.listen);
        console.log(`Service running at http://localhost:${this.settingCnf.listen}`);
    }
}