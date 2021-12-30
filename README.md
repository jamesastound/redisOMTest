# redisOMTest - Dynamic MYSQL

Testing [redis-om-node](https://github.com/redis/redis-om-node) Dynamimc MYSQL Integration

Test environment uses Redis-OM `redislabs/redismod:preview` docker container, from the [Getting Started](https://github.com/redis/redis-om-node/blob/main/README.md) section of the documentation. This includes RedisSearch and RedisJSON.

### Testing Goals:

- Dynamically generate Redis OM Schema using MYSQL Schema
- Redis-OM Team is looking to add support for [Dates](https://github.com/redis/redis-om-node/issues/5). Until then, date data types will need to be converted to numeric values. For now, [util/timstamp.js](https://github.com/jamesastound/redisOMTest/blob/master/main/util/timestamp.js), converts to UNIX Timestamps.
- Insert data into Redis OM repository.
- Track inserts based on an index key (timestamp or auto increment value/other unique integer)

### Testing Limits:

- I don't have current plans to create a distributable package, so MYSQL Data Types are limited to those found in [util/conversion.js](https://github.com/jamesastound/redisOMTest/blob/master/main/util/conversion.js).
- I don't use other data types, so types that don't result in a string, number or timestamp are not being considered in this project.

### Example Schema Generation

```
const omSchema = await buildSchema({ tableName: "Completion_Status_Log" });
console.log(omSchema);
```

```
Schema {
  entityCtor: [class Completion_Status_Log extends Entity],
  definition: {
    rowID: { type: 'number' },
    Active: { type: 'number' },
    Order_ID: { type: 'string' },
    Order_Status: { type: 'number' },
    Notes: { type: 'string' },
    Time_Date: { type: 'number' },
    Tech_ID: { type: 'string' }
  },
  options: { dataStructure: 'JSON', useStopWords: 'OFF' }
}
```

### Example Database Insert with timedate index.

```
$ npm run test

> main@1.0.0 test
> node main.js

Inserting MYSQL Database rows from Completion_Status_Log into Redis OM, indexing on Time_Date.
Created Redis-OM Schema.
Using 0 as the starting index (1970-01-01 00:00:00).
Retrieved 10 rows from the MYSQL Database.
Successfully inserted 10 of 10 rows into Redis OM.
Updated last index to 1275915003 (2010-06-07 12:50:03).
Updated RedisSearch Index.
Inserted into Redis-OM Repository. [
  '01FR689E7HA8DNM6CPECK0W2F',
  '01FR689E7KJWGTA50PPN07NRW',
  '01FR689E7MFWQNF5VZFY6PVH7',
  '01FR689E7M04VQ0V6YF3XYS5S',
  '01FR689E7M8QK660MN86A01QW',
  '01FR689E7N4M7Y0FRDCX8SQ8V',
  '01FR689E7NZRCXF6WM8Y4MWYM',
  '01FR689E7PP43WBYX7WTHPRBY',
  '01FR689E7P5SAA7SADS1C2X35',
  '01FR689E7P4C4QY8BMYYZDGWP'
]
```

### Example Database Insert with int index.

```
$ npm run test

> main@1.0.0 test
> node main.js

Inserting MYSQL Database rows from Address_Data into Redis OM, indexing on Address_ID.
Created Redis-OM Schema.
Using 99 as the starting index.
Retrieved 10 rows from the MYSQL Database.
Successfully inserted 10 of 10 rows into Redis OM.
Updated last index to 110.
Updated RedisSearch Index.
Inserted into Redis-OM Repository. [
  '01FR68CAJ4B7MAZ1V832TG6JRZ',
  '01FR68CAJ6AXX10FEWFPJJHB3S',
  '01FR68CAJ61N93XFF836P50HHS',
  '01FR68CAJ7KBPYHX72MC9MD74B',
  '01FR68CAJ7MGC9JSSHK19XDT3Y',
  '01FR68CAJ8TVRH9N9PMV1H1E7G',
  '01FR68CAJ8XJQF2NCN84PKV3HF',
  '01FR68CAJ8K9H28HJ9P2P2R63N',
  '01FR68CAJ9R4MDQAZPZM6ABD61',
  '01FR68CAJ976VK7S4526JBJBM5'
]
```

### Tested MYSQL Database Table Schemas:

- [SAMPLE_DB_SCHEMA1.md](https://github.com/jamesastound/redisOMTest/blob/master/SAMPLE_DB_SCHEMA1.md) (Completion_Status_Log)
- [SAMPLE_DB_SCHEMA2.md](https://github.com/jamesastound/redisOMTest/blob/master/SAMPLE_DB_SCHEMA2.md) (Address_Data)
