import {Sequelize} from "sequelize";
import Jsonfile from "jsonfile";

export class Model {

    constructor(table, struct) {
        try {
            const cnf = Jsonfile.readFileSync('config/database.json');
            this.sequelize = new Sequelize(
                cnf.database,
                cnf.username,
                cnf.password,
                cnf.options,
            );
            //this.sequelize.authenticate();
            this.obj = this.sequelize.define(table, struct);
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    findAll() {
        return this.obj.findAll();
    }
}