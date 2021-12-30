const mysqlToRedisOMDataTypes = require("../util/conversion.js");
const extendClass = require("../util/extendClass.js");
// https://github.com/redis/redis-om-node
const { Entity, Schema } = require("redis-om");

const buildSchema = async ({ tableName, options }) => {
  // Connect to MYSQL Database
  const sqlConnection = await require("../util/database.js");

  // Get the table schema from the MYSQL Database
  const databaseSchema = await sqlConnection.query(`describe ${tableName}`).catch((err) => {
    console.error(
      "Database Error. Did you change the configuration options to valid values? ERROR MESSAGE:",
      err.sqlMessage
    );
    process.exit(1);
  });
  console.log(databaseSchema);
  // Close the sqlConnection to the MYSQL Database
  await sqlConnection.pause();

  // Map the MYSQL Data Types to Redis-OM Data Types
  const mapSchema = databaseSchema
    .map((line) => {
      const { Field, Type } = line;
      const { omType } = mysqlToRedisOMDataTypes.find((line) => line.sqlType === Type.split("(")[0]) || {};
      return { Field, Type, omType };
    })
    .filter((line) => {
      if (line.omType !== undefined) {
        return true;
      } else {
        console.error(`${line.Field} is not a data type defined in conversion.js.`);
        return false;
      }
    });

  // Create the Redis-OM Schema
  const omScehma = {};
  mapSchema.forEach((line) => {
    omScehma[line.Field] = { type: line.omType };
  });

  // Create the Redis-OM Entity
  process[tableName] = extendClass(tableName, Entity);

  // Return the Redis-OM Schema
  return new Schema(process[tableName], omScehma, options);
};

module.exports = buildSchema;
