const { BadRequestError } = require('../expressError');

// This Function Makes a SQL Update Based on the Object Keys that are provided to it and handles the parameters accordingly, assigning $1, $2 to each key
// The keys must be part of the existing JSON Schema

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError('No data');

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  // Each Object Key will represent a SQL Column to Update and will be converted appropriately to $1, $2, etc
  const cols = keys.map(
    (colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(', '),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
