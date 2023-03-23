import tools from "../../func/tools.js";
import {Hi} from "../../model/test/hi.js";
export class index {

    constructor(ctx) {
        this.ctx = ctx;
    }

    async get() {
        let res = await (new Hi()).getAll();
        tools.ajax(this.ctx, 1, 'ok', res);
    }

    async post() {}

    async put() {}

    async delete() {}
}