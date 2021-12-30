const convertMYSQLTimestamp = (dbData) => {
  // Convert MYSQL Timestamp to milliseconds
  return dbData.map((line) => {
    for (const key in line) {
      if (line[key] instanceof Date) {
        line[key] = line[key].getTime() / 1000;
      }
    }
    return line;
  });
};

const convertBackToDate = (unixtime) => {
  return new Date(unixtime * 1000).toISOString().slice(0, 19).replace("T", " ");
};

module.exports = { convertMYSQLTimestamp, convertBackToDate };
