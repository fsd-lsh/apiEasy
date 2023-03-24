import Koa from "koa";
import Router from "@koa/router";
import session from "koa-session";

const app = new Koa();
const router = new Router();

export class Bootstrap {

    constructor({routerCnf, settingCnf, sessionCnf}) {
        this.routerCnf = routerCnf;
        this.settingCnf = settingCnf;
        this.sessionCnf = sessionCnf;
        app.use(session(this.sessionCnf, app))
    }

    rpc(both) {
        this.settingCnf.mode = both ? 'rpc' : this.settingCnf.mode;
        for (let routePath of this.routerCnf[this.settingCnf.mode]) {
            router.all(routePath, async (ctx, next) => {
                const urlPath = this.urlParse(ctx.originalUrl);
                const controllerPath = urlPath.slice(0, urlPath.lastIndexOf('/'));
                const className = controllerPath.slice(controllerPath.lastIndexOf('/')+1, controllerPath.length);
                const funcName = urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length);
                const controller =  await import(`../controller${controllerPath}.js`);
                await (new controller[className](ctx))[funcName]();
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
                    const urlPath = this.urlParse(ctx.originalUrl);
                    await ctx.set(this.settingCnf.headers);
                    method = (method === '/') ? 'index' : method;
                    const controller =  await import(`../controller${urlPath}.js`);
                    const className = urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length);
                    await (new controller[className](ctx))[method]();
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

    run() {
        app.keys = ['apiEasy'];
        app.use(router.routes())
           .use(router.allowedMethods());
        app.listen(this.settingCnf.listen);
    }
}