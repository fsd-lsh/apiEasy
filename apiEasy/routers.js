import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();

export class Routers {

    constructor(routerCnf, settingCnf) {
        this.routerCnf = routerCnf;
        this.settingCnf = settingCnf;
    }

    rpc() {

    }

    restful() {
        for (let method in this.routerCnf[this.settingCnf.mode]) {
            for (let routePath in this.routerCnf[this.settingCnf.mode][method]) {
                router[method](routePath, async (ctx, next) => {
                    let urlPathArr;
                    if(ctx.originalUrl.indexOf('?') !== -1) {
                        urlPathArr = ctx.originalUrl.slice(0, ctx.originalUrl.indexOf('?'));
                    }else {
                        urlPathArr = ctx.originalUrl;
                    }
                    await ctx.set(this.settingCnf.headers);
                    method = (method === '/') ? 'index' : method;
                    const controller =  await import(`../controller${urlPathArr}.js`);
                    const className = urlPathArr.slice(urlPathArr.lastIndexOf('/')+1, urlPathArr.length);
                    await (new controller[className](ctx))[method]();
                });
            }
        }
        this.run();
    }

    both() {

    }

    run() {
        app
            .use(router.routes())
            .use(router.allowedMethods());
        app.listen(this.settingCnf.listen);
    }
}