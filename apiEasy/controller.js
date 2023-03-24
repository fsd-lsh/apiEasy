export class Controller {

    constructor(ctx) {
        this.ctx = ctx
    }

    ajax(code, info, data) {
        this.ctx.body = {
            code: Number(code),
            info: info ? info : '',
            data: data ? data : [],
        }
    }
}