import Jsonfile from "jsonfile";
import {Bootstrap} from "./apiEasy/bootstrap.js";

const routerCnf = Jsonfile.readFileSync('config/router.json');
const settingCnf = Jsonfile.readFileSync('config/setting.json');
const sessionCnf = Jsonfile.readFileSync('config/session.json');

(new Bootstrap({
    routerCnf,
    settingCnf,
    sessionCnf,
}))[settingCnf.mode]();