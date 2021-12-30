// https://github.com/CodeFoodPixels/node-promise-mysql
const mysql = require("promise-mysql");
// https://github.com/motdotla/dotenv
require("dotenv").config();
const sqlConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  reconnect: true,
});

module.exports = sqlConnection;
