import {Session} from "./session.js";

export class Controller {

    constructor(ctx) {
        this.ctx = ctx;
        this.sessionHandle = new Session(ctx);
    }

    ajax(code, info, data) {
        this.ctx.body = {
            code: Number(code),
            info: info ? info : '',
            data: data ? data : [],
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