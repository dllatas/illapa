const teseo = require('teseo');
const analysis = require('./analysis');
const synthesis = require('./synthesis');

const main = (schema, flavor, master, name) => {
  // Sort schema
  const sortedSchema = teseo.sort(schema, master, name);
  console.info('Schema sorting finished succesfully.');

  // Execute analysis on schema object
  const analyzedSchema = analysis(sortedSchema);
  console.info('Schema analysis finished succesfully.');
  console.log(analyzedSchema);

  // Generate SQL code from analyzed schema
  const ddlCode = synthesis(analyzedSchema, flavor);
  console.info('Schema synthesis finished succesfully.');

  return ddlCode;
};

module.exports = main;
