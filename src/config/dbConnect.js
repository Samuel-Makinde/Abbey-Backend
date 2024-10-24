const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log(process.env.DB_DATABASE)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
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




