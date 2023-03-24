import {Controller} from "../../apiEasy/controller.js";
import {Hi} from "../../model/test/hi.js";

export class go extends Controller {

    constructor(ctx) {
        super(ctx);
        this.ctx = ctx;
    }

    async get() {
        let res = await (new Hi()).getAll();
        this.ajax(1, 'get', res);
    }

    async post() {
        this.ajax(1, 'post');
    }

    async put() {
        this.ajax(1, 'put');
    }

    async delete() {
        this.ajax(1, 'delete');
    }
}