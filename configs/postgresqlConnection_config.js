const Sequelize = require("sequelize");
const maxConnectionPostgreSQL = parseInt(process.env.POSTGRESQL_MAXCONNECTION) || 5
const minConnectionPostgreSQL = parseInt(process.env.POSTGRESQL_MINCONNECTION) || 0
const acquirePostgreSQL = parseInt(process.env.POSTGRESQL_ACQUIRE) || 60000
const idlePostgreSQL = parseInt(process.env.POSTGRESQL_IDLE) || 10000

const sequelize = new Sequelize(
  process.env.POSTGRESQL_DB,
  process.env.POSTGRESQL_USER,
  process.env.POSTGRESQL_PASS,
  {
    host: process.env.POSTGRESQL_HOST,
    port: process.env.POSTGRESQL_PORT,
    dialect: "postgres",
    pool: {
      max: maxConnectionPostgreSQL,
      min: minConnectionPostgreSQL,
      acquire: acquirePostgreSQL,
      idle: idlePostgreSQL,
    },
    define: {
      timestamps: true,
      freezeTableName: true,
    },
    logging: (msg) => {
      const logEntry = {
        timestamp: new Date(),
        message: msg
      };
    }
  }
);

if (process.env.POSTGRESQL_SYNC == "true") {
  sequelize.sync({
    force: false,
    alter: true,
  })
}

module.exports = sequelize;
