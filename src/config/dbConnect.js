const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  "postgres",
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    dialect: "postgres",
    host: process.env.HOST,
    port: process.env.DB_PORT,
    pool: {
      max: 100,
      min: 0,
      acquire: 1000000,
      idle: 100000,
      evict: 2000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync();
    await sequelize.sync({ alter: true });
    console.log("Connected to the postgress Server with Sequelize");
  } catch (error) {
    console.error("Error connecting to server with Sequelize:", error);
  }
};

module.exports = { sequelize, connectDB };
