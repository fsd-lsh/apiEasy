import Koa from "koa";
import Router from "@koa/router";
import Jsonfile from "jsonfile";

const app = new Koa();
const router = new Router();
const settingCnf = Jsonfile.readFileSync('config/setting.json');
const routerCnf = Jsonfile.readFileSync('config/router.json');

switch (settingCnf.mode) {
    case 'rpc': {
        break;
    }
    case 'restful': {
        for (let method in routerCnf[settingCnf.mode]) {
            for (let routePath in routerCnf[settingCnf.mode][method]) {
                router[method](routePath, async (ctx, next) => {
                    let urlPathArr;
                    if(ctx.originalUrl.indexOf('?') !== -1) {
                        urlPathArr = ctx.originalUrl.slice(0, ctx.originalUrl.indexOf('?'));
                    }else {
                        urlPathArr = ctx.originalUrl;
                    }
                    await ctx.set(settingCnf.headers);
                    method = (method === '/') ? 'index' : method;
                    const controller =  await import(`./controller${urlPathArr}.js`);
                    const className = urlPathArr.slice(urlPathArr.lastIndexOf('/')+1, urlPathArr.length);
                    await (new controller[className](ctx))[method]();
                });
            }
        }
        break;
    }
    default: { break; }
}

app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(settingCnf.listen);