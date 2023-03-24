export class Session {

    constructor(ctx) {
        this.ctx = ctx;
    }

    get(key) {
        return this.ctx.session[key];
    }

    set(key, value) {
        return this.ctx.session[key] = value;
    }

    del(key) {
        return this.ctx.session[key] = null;
    }

    getAll() {
        return this.ctx.session;
    }

    delAll() {
        return this.ctx.session = null;
    }
}