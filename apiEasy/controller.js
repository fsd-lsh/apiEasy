import {Session} from "./session.js";
import func from "./funcs.js";

export class Controller {

    constructor(ctx) {
        global['apiEasy'] = (new Date().getTime());
        this.ctx = ctx;
        this.viewAssign = {};
        this.sessionHandle = new Session(ctx);
    }

    ajax(code, info, data) {
        func.ajax(this.ctx, code, info, data);
    }

    async view(root, assign) {
        if(!root) { root = 'index'; }
        this.viewAssign = Object.assign(this.viewAssign, assign);
        await this.ctx.render(root, this.viewAssign);
    }

    wAssign(key, value) {
        if(!key) {
            return false;
        }
        this.viewAssign[key] = value;
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

    redirect(url) {
        if(!url) { return false; }
        this.ctx.redirect(url);
    }
}