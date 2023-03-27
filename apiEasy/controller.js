import {Session} from "./session.js";
import func from "./funcs.js";

export class Controller {

    constructor(ctx) {
        global['apiEasy'] = (new Date().getTime());
        this.ctx = ctx;
        this.sessionHandle = new Session(ctx);
    }

    ajax(code, info, data) {
        func.ajax(this.ctx, code, info, data);
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