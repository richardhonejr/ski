// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_ski_db";
import UserModel from "../models/Ski_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.ski_db.host +
        ":" +
        properties.ski_db.port +
        "//" +
        properties.ski_db.user +
        "@" +
        properties.ski_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.ski_db.name,
      properties.ski_db.user,
      properties.ski_db.password,
      {
        host: properties.ski_db.host,
        dialect: properties.ski_db.dialect,
        port: properties.ski_db.port,
        logging: false
      }
    );
    this.dbConnection_ski_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_ski_db;
  }
}

export default new Database();
