// Testing Redis-OM Dynamic MYSQL
const buildSchema = require("./build/buildSchema");
const buildRepository = require("./build/buildRepository");
const { convertMYSQLTimestamp, convertBackToDate } = require("./util/timestamp");
const DBInsert = require("./build/DBInsert");
const { Client } = require("redis-om");
require("dotenv").config();

(async function main() {
  try {
    /********************
     * CONFIGURE SCRIPT *
     ********************/

    // Also update .env_sample with your credentials and rename to .env

    const tableName = "Customer_Table"; // MYSQL Database Table Name
    const tableIndex = "Customer_ID"; // Timestamp column name to use as insertion index.
    const tableIndexType = "int"; // Choose between 'timedate' (for timestamps) or 'int' (for auto-increment)
    const tableLimit = 1000; // Maximum number of rows to insert at a time.

    // Add Redis-OM Options
    const options = {
      dataStructure: "JSON", // USE Redis-JSON
      useStopWords: "OFF", // Turn off Redis-SEARCH Stop Words
      // https://github.com/redis/redis-om-node/issues/13
    };

    /************************
     * END CONFIGURE SCRIPT *
     ************************/

    console.log(`Inserting MYSQL Database rows from ${tableName} into Redis OM, indexing on ${tableIndex}.`);

    // Create Redis OM Schema
    const omSchema = await buildSchema({ tableName, options });
    console.log("Created Redis-OM Schema.");
    // console.log(omSchema);

    // Create Redis OM Client
    const omClient = new Client();
    await omClient.open(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`).catch((err) => {
      console.error("Could not connect to Redis, check your .env settings.", err);
      process.exit(1);
    });
    console.log(`Connected to Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

    // Delete last index if it exists
    // const deleteIndex = new DBInsert({ tableName, omClient }).deleteLastIndex();

    // Get latest index for this table.
    const lastIndex = (await new DBInsert({ tableName, omClient }).getLastIndex()) || 0;
    const timeConvert = tableIndexType === "timedate" ? ` (${convertBackToDate(lastIndex)})` : "";
    console.log(`Using ${lastIndex} as the starting index${timeConvert}.`);

    // Generate MYSQL WHERE clause depending on tableIndexType
    const whereClause = tableIndexType === "timedate" ? `UNIX_TIMESTAMP(${tableIndex})` : `${tableIndex}`;

    // Get the data from the MYSQL Database
    const sqlConnection = await require("./util/database.js");
    await sqlConnection.resume();
    const dbData = await sqlConnection
      .query(
        `SELECT * FROM ${tableName} WHERE ${whereClause} > ${lastIndex} ORDER BY ${tableIndex} ASC LIMIT ${tableLimit}`
      )
      .catch((err) => {
        console.error(
          "Database Error. Did you change the configuration options to valid values? ERROR MESSAGE:",
          err.sqlMessage
        );
        process.exit(1);
      });

    console.log(`Retrieved ${dbData.length} rows from the MYSQL Database.`);

    await sqlConnection.end();

    if (dbData.length === 0) {
      console.log("No new data to insert.");
      // process.exit();
    }

    // Check if any of the database entries are dates and conver them to unix timestamps.
    const dbDataConverted = convertMYSQLTimestamp(dbData);

    // Insert the data into Redis OM Repository
    const { omInsert, repository } = await buildRepository({
      omSchema,
      omClient,
      dbData: dbDataConverted,
      tableIndex,
      tableName,
      tableIndexType,
    });

    console.log("Inserted into Redis-OM Repository.", omInsert[0]);
    console.log("Dropping Index");
    await repository.dropIndex();
    console.log("Creating Index");
    await repository.createIndex();
    // const test = await repository.search().return.count();
    // const mapped = test.length > 0 ? test.map((res) => `${res.First_Name} ${res.Last_Name}`) : test;
    // console.log("test", mapped);

    // const test2 = await repository.search().where("First_Name").matches("James").return.all();
    // console.log("test2", test2);
    await omClient.close();

    process.exit();
  } catch (e) {
    console.log(e);
  }
})();
