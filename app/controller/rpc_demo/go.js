import {Controller} from "../../../apiEasy/controller.js";
import {Hi} from "../../model/test/hi.js";

export class go extends Controller {

    constructor(ctx) {
        super(ctx);
    }

    hi() {
        // Response mode 1
        //this.ajax(1, 'ok', [{1: 2}]);

        // Response mode 2
        return [{1: 2}];
    }

    async fetch_some_data() {
        let res = await (new Hi()).getAll();
        this.ajax(1, 'ok', res);
    }
}