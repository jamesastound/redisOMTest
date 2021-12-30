const buildSchema = require("./build/build");
(async function main() {
  try {
    const omSchema = await buildSchema({ tableName: "Completion_Status_Log" });
    console.log(omSchema);
  } catch (e) {
    console.log(e);
  }
})();
