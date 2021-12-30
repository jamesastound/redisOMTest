const mysqlToRedisOMDataTypes = require("../util/conversion.js");
const extendClass = require("../util/extendClass.js");
// https://github.com/redis/redis-om-node
const { Entity, Schema } = require("redis-om");

const buildSchema = async ({ tableName }) => {
  // Connect to MYSQL Database
  const connection = await require("../util/database.js");

  // Get the table schema from the MYSQL Database
  const databaseSchema = await connection.query(`describe ${tableName}`);
  // console.log(databaseSchema);
  // Close the connection to the MYSQL Database
  await connection.end();

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

  // Add Redis-OM Options
  const options = {
    dataStructure: "JSON", // USE Redis-JSON
    useStopWords: "OFF", // Turn off Redis-SEARCH Stop Words
    // https://github.com/redis/redis-om-node/issues/13
  };

  // Return the Redis-OM Schema
  return new Schema(process[tableName], omScehma, options);
};

module.exports = buildSchema;
