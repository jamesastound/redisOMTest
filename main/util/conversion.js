// MYSQL Data Types to Redis-OM Data Types Lookup Array

// TODO: Redis-OM Team looking into Time data type. For now, these will need to be converted to numbers.

const mysqlToRedisOMDataTypes = [
  { sqlType: "int", omType: "number" },
  { sqlType: "smallint", omType: "number" },
  { sqlType: "tinyint", omType: "number" },
  { sqlType: "mediumint", omType: "number" },
  { sqlType: "bigint", omType: "number" },
  { sqlType: "float", omType: "number" },
  { sqlType: "double", omType: "number" },
  { sqlType: "decimal", omType: "number" },
  { sqlType: "varchar", omType: "string" },
  { sqlType: "char", omType: "string" },
  { sqlType: "tinytext", omType: "string" },
  { sqlType: "text", omType: "string" },
  { sqlType: "mediumtext", omType: "string" },
  { sqlType: "longtext", omType: "string" },
  { sqlType: "date", omType: "number" },
  { sqlType: "datetime", omType: "number" },
  { sqlType: "timestamp", omType: "number" },
  { sqlType: "time", omType: "number" },
  { sqlType: "year", omType: "number" },
  { sqlType: "bool", omType: "boolean" },
];

module.exports = mysqlToRedisOMDataTypes;
