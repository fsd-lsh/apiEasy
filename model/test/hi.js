import {Model} from "../../apiEasy/model.js";
import {DataTypes} from "sequelize";

export class Hi extends Model {

    constructor() {
        super('poem_sys_admin', {
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            roles: DataTypes.TEXT,
            status: DataTypes.TINYINT,
            ctime: DataTypes.STRING,
            utime: DataTypes.STRING,
        });
    }

    getAll() {
        return this.findAll()
    }
}