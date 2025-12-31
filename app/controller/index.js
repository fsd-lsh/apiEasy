import {Controller} from "../../apiEasy/controller.js";

export class index extends Controller {

    constructor(ctx) {
        super(ctx);
    }

    index() {
        this.ajax(1, 'Hello ApiEasy', []);
    }
}