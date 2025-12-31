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
        const urlPath = routePath === '/' ? '/index' : routePath;
        let controllerPath = urlPath.slice(0, urlPath.lastIndexOf('/'));
        let className = urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length);
        let funcName = method === 'all' ? urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length) : method;
        
        if (!controllerPath) controllerPath = '/index';
        if (!className) className = 'index';
        if (!funcName || funcName === '/') funcName = 'index';
        
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
                const data = await (new controller[className](ctx))[funcName](this.paramsFormat(ctx));
                this.autoResponse(ctx, data);
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
                    const data = await (new controller[className](ctx))[funcName](this.paramsFormat(ctx));
                    this.autoResponse(ctx, data);
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

    autoResponse(ctx, data) {
        if(data && this.settingCnf.autoResponse.enable) {
            const hasContent = typeof data !== 'object' ? true : Array.isArray(data) ? data.length : Object.keys(data).length;
            func.ajax(ctx, hasContent ? this.settingCnf.autoResponse.success.code : this.settingCnf.autoResponse.error.code, hasContent ? this.settingCnf.autoResponse.success.info : this.settingCnf.autoResponse.error.info, hasContent ? data : undefined);
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