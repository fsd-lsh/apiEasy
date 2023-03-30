import Jsonfile from "jsonfile";
import Path from "path";
import {Bootstrap} from "../apiEasy/bootstrap.js";
import func from "../apiEasy/funcs.js";

const projectFlag = func.projectFlag();

global.apiEasyRoot = Path.resolve('./');
global.routerCnf = Jsonfile.readFileSync(`${global.apiEasyRoot}/${projectFlag}/config/router.json`);
global.settingCnf = Jsonfile.readFileSync(`${global.apiEasyRoot}/${projectFlag}/config/setting.json`);
global.sessionCnf = Jsonfile.readFileSync(`${global.apiEasyRoot}/${projectFlag}/config/session.json`);

(new Bootstrap(projectFlag))[global.settingCnf.mode]();