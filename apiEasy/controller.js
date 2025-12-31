import func from "./funcs.js";

export class Controller {

    constructor(ctx) {
        this.startTime = (new Date().getTime());
        this.ctx = ctx;
        this.viewAssign = {};
    }

    ajax(code, info, data) {
        func.ajax(this.ctx, code, info, data, this.startTime);
    }

    async view(root, assign) {
        if(!root) { root = 'index'; }
        if(assign) {
            Object.assign(this.viewAssign, assign);
        }
        await this.ctx.render(root, this.viewAssign);
    }

    wAssign(key, value) {
        if(!key) {
            return false;
        }
        this.viewAssign[key] = value;
    }

    session(key, value) {
        if (!key) {
            return this.ctx.session;
        }
        if (key === '') {
            this.ctx.session = null;
            return;
        }
        if (value !== undefined) {
            if (value === '') {
                this.ctx.session[key] = null;
            } else {
                this.ctx.session[key] = value;
            }
            return;
        }
        return this.ctx.session[key];
    }

    redirect(url) {
        if(!url) { return false; }
        this.ctx.redirect(url);
    }
}