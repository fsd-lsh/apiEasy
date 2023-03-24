import {Session} from "./session.js";
import Jsonfile from "jsonfile";

const settingCnf = Jsonfile.readFileSync('config/setting.json');

export class Controller {

    constructor(ctx) {
        global['apiEasy'] = (new Date().getTime());
        this.ctx = ctx;
        this.sessionHandle = new Session(ctx);
    }

    ajax(code, info, data) {
        this.ctx.body = {
            code: Number(code),
            info: info ? info : '',
            data: data ? data : [],
        }
        if(settingCnf.debug) {
            Object.assign(this.ctx.body, {
                runtime: (new Date().getTime()) - (global['apiEasy']) + 'ms',
            });
        }
    }

    session(key, value) {
        if(key && value) {
            this.sessionHandle.set(key, value);
        }else if(key && !value) {
            return this.sessionHandle.get(key);
        }else if(key && value === '') {
            this.sessionHandle.del(key);
        }else if(key === ''){
            this.sessionHandle.delAll();
        }else {
            return this.sessionHandle.getAll();
        }
    }
}