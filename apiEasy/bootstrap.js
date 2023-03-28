import Koa from "koa";
import Router from "@koa/router";
import Session from "koa-session";
import BodyParser from "koa-bodyparser";
import func from "./funcs.js";

const app = new Koa();
const router = new Router();

export class Bootstrap {

    constructor({routerCnf, settingCnf, sessionCnf}) {
        this.routerCnf = routerCnf;
        this.settingCnf = settingCnf;
        this.sessionCnf = sessionCnf;
        app.use(BodyParser());
        app.use(Session(this.sessionCnf, app));
    }

    rpc(both) {
        this.settingCnf.mode = both ? 'rpc' : this.settingCnf.mode;
        for (let routePath of this.routerCnf[this.settingCnf.mode]) {
            router.all(routePath, async (ctx, next) => {
                await ctx.set(this.settingCnf.headers);
                const urlPath = this.urlParse(ctx.originalUrl);
                const controllerPath = urlPath.slice(0, urlPath.lastIndexOf('/'));
                const className = controllerPath.slice(controllerPath.lastIndexOf('/')+1, controllerPath.length);
                const funcName = urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length);
                const controller =  await import(`../controller${controllerPath}.js`);
                const obj = await (new controller[className](ctx))[funcName](this.paramsFormat(ctx));
                this.autoResponse(ctx, obj);
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
                    const urlPath = this.urlParse(ctx.originalUrl);
                    method = (method === '/') ? 'index' : method;
                    const controller =  await import(`../controller${urlPath}.js`);
                    const className = urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length);
                    const obj = await (new controller[className](ctx))[method](this.paramsFormat(ctx));
                    this.autoResponse(ctx, obj);
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

    urlParse(url) {
        if(url.indexOf('?') !== -1) {
            return url.slice(0, url.indexOf('?'));
        }else {
            return url;
        }
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
            if(data.length) {
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
                    data
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