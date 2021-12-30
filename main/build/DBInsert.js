// Keep track of an index value if continually inserting new SQL data into Redis OM

class DBInsert {
  constructor({ tableName, omClient }) {
    this.tableName = tableName;
    this.omClient = omClient;
    this.key = `${this.tableName}:lastDBInsert`;
  }

  async getLastIndex() {
    // Returns NULL if this is the first time
    return this.omClient.execute(["GET", this.key]);
  }

  async setLastIndex(lastIndex) {
    this.lastIndex = lastIndex;
    if (this.lastIndex === undefined) {
      throw new Error("lastIndex is undefined");
    }
    return this.omClient.execute(["SET", this.key, this.lastIndex]);
  }

  async deleteLastIndex() {
    // Remove index to re-insert all data
    return this.omClient.execute(["DEL", this.key]);
  }
}

module.exports = DBInsert;
