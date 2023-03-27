import Jsonfile from "jsonfile";

const settingCnf = Jsonfile.readFileSync('config/setting.json');

export default {
    ajax(ctx, code, info, data) {
        let body = {
            code: Number(code),
            info: info ? info : '',
        }
        if(data.length) {
            body.data = data;
        }
        ctx.body = body;
        if(settingCnf.debug) {
            Object.assign(ctx.body, {
                runtime: (new Date().getTime()) - (global['apiEasy']) + 'ms',
            });
        }
    }
}