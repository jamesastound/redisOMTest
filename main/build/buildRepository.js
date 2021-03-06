const { Repository } = require("redis-om");
const DBInsert = require("./DBInsert");
const { convertBackToDate } = require("../util/timestamp");
const buildRepository = async ({ omSchema, omClient, dbData, tableIndex, tableName, tableIndexType }) => {
  // Create a new Repository object

  // class CustomRepository extends Repository {
  //   createEntity(data) {
  //     let id = createMyCustomID;
  //     let entity = new this.schema.entityCtor(this.schema.definition, id);
  //     for (let key in data) {
  //       if (this.schema.entityCtor.prototype.hasOwnProperty(key)) {
  //         entity[key] = data[key];
  //       }
  //     }
  //     return entity;
  //   }
  // }

  // Changed to redis-om 0.2.0 method.
  const repository = omClient.fetchRepository(omSchema);

  // Track Last Index
  let lastIndex = 0;

  // Insert the data into Redis OM Repository
  const omInsert = await Promise.all(
    dbData.map(async (item) => {
      // Update last index.
      if (item[tableIndex] > lastIndex) {
        lastIndex = item[tableIndex];
      }
      // Create Redis OM Entity
      const dbEntry = repository.createEntity(item);
      // Return Redis OM Entity ID
      // Redis Key is tableName + Entity ID.
      return await repository.save(dbEntry).catch((err) => {
        console.error(err);
        console.log(item);
      });
    })
  );

  // Check successful inserts
  const successfulInserts = omInsert.filter((insert) => insert !== null);
  console.log(`Successfully inserted ${successfulInserts.length} of ${dbData.length} rows into Redis OM.`);

  // Set last index
  await new DBInsert({ tableName, omClient }).setLastIndex(lastIndex);

  const timeConvert = tableIndexType === "timedate" ? ` (${convertBackToDate(lastIndex)})` : "";

  console.log(`Updated last index to ${lastIndex}${timeConvert}.`);

  // Refresh Search Index.
  await repository.dropIndex();
  await repository.createIndex();
  console.log("Updated RedisSearch Index.");
  return { omInsert, repository };
};

module.exports = buildRepository;
