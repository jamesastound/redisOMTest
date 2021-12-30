# redisOMTest - Dynamic MYSQL

Testing [redis-om-node](https://github.com/redis/redis-om-node) Dynamimc MYSQL Integration

Example

```Javascript
const omSchema = await buildSchema({ tableName: "Completion_Status_Log" });
console.log(omSchema);

// Schema {
//   entityCtor: [class Completion_Status_Log extends Entity],
//   definition: {
//     rowID: { type: 'number' },
//     Active: { type: 'number' },
//     Order_ID: { type: 'string' },
//     Order_Status: { type: 'number' },
//     Notes: { type: 'string' },
//     Time_Date: { type: 'number' },
//     Tech_ID: { type: 'string' }
//   },
//   options: { dataStructure: 'JSON', useStopWords: 'OFF' }
// }

```

Testing goals:

- Dynamically generate Redis-OM Schema using MYSQL Schema
- Redis-OM Team is looking to add support for [Dates](https://github.com/redis/redis-om-node/issues/5). Until then, date data types will need to be converted to numeric values.

Tested Database Table Schema:

```Javscript
console.log(databaseSchema);

[
  RowDataPacket {
    Field: 'rowID',
    Type: 'int(11)',
    Null: 'NO',
    Key: 'PRI',
    Default: null,
    Extra: 'auto_increment'
  },
  RowDataPacket {
    Field: 'Active',
    Type: 'tinyint(1)',
    Null: 'NO',
    Key: 'MUL',
    Default: '0',
    Extra: ''
  },
  RowDataPacket {
    Field: 'Order_ID',
    Type: 'varchar(6)',
    Null: 'NO',
    Key: 'MUL',
    Default: null,
    Extra: ''
  },
  RowDataPacket {
    Field: 'Order_Status',
    Type: 'smallint(5)',
    Null: 'NO',
    Key: '',
    Default: null,
    Extra: ''
  },
  RowDataPacket {
    Field: 'Notes',
    Type: 'text',
    Null: 'YES',
    Key: '',
    Default: null,
    Extra: ''
  },
  RowDataPacket {
    Field: 'Time_Date',
    Type: 'timestamp',
    Null: 'NO',
    Key: 'MUL',
    Default: 'CURRENT_TIMESTAMP',
    Extra: ''
  },
  RowDataPacket {
    Field: 'Tech_ID',
    Type: 'varchar(3)',
    Null: 'NO',
    Key: 'MUL',
    Default: '10',
    Extra: ''
  }
]
```
