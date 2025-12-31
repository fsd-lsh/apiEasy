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
        app.use(BodyParser());
        app.use(Session(this.sessionCnf, app));
        app.use(Views(`${global.apiEasyRoot}/${this.projectFlag}/views/`, {extension: 'ejs'}));
        app.use(Static(`${global.apiEasyRoot}/${this.projectFlag}/static/`));
    }

    rpc(both) {
        this.settingCnf.mode = both ? 'rpc' : this.settingCnf.mode;
        for (let routePath of this.routerCnf[this.settingCnf.mode]) {
            router.all(routePath, async (ctx, next) => {
                await ctx.set(this.settingCnf.headers);
                const urlPath = func.urlParse(ctx.originalUrl);
                let controllerPath = urlPath.slice(0, urlPath.lastIndexOf('/'));
                let className = controllerPath.slice(controllerPath.lastIndexOf('/')+1, controllerPath.length);
                let funcName = urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length);
                if(!controllerPath) { controllerPath = '/index' }
                if(!className) { className = 'index'; }
                if(!funcName) { funcName = 'index'; }
                const controller =  await import(`../${this.projectFlag}/controller${controllerPath}.js`);
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
                router[method](routePath, async (ctx, next) => {
                    await ctx.set(this.settingCnf.headers);
                    const urlPath = func.urlParse(ctx.originalUrl);
                    method = (method === '/') ? 'index' : method;
                    const controller =  await import(`../${this.projectFlag}/controller${urlPath}.js`);
                    const className = urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length);
                    const data = await (new controller[className](ctx))[method](this.paramsFormat(ctx));
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
            if(data.length || Object.values(data).length) {
                func.ajax(
                    ctx,
                    this.settingCnf.autoResponse.success.code,
                    this.settingCnf.autoResponse.success.info,
                    data
                );
            }else {
                func.ajax(
                    ctx,
                    this.settingCnf.autoResponse.error.code,
                    this.settingCnf.autoResponse.error.info,
                );
            }
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