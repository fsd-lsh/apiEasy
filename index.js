import Jsonfile from "jsonfile";
import {Routers} from "./apiEasy/routers.js";

const routerCnf = Jsonfile.readFileSync('config/router.json');
const settingCnf = Jsonfile.readFileSync('config/setting.json');

(new Routers(
    routerCnf,
    settingCnf
))[settingCnf.mode]();