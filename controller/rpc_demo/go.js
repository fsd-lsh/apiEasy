import {Controller} from "../../apiEasy/controller.js";
import {Hi} from "../../model/test/hi.js";

export class go extends Controller {

    constructor(ctx) {
        super(ctx);
    }

    hi() {
        this.ajax(1, 'ok');
    }

    async fetch_some_data() {
        let res = await (new Hi()).getAll();
        this.ajax(1, 'ok', res);
    }
}