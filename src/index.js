const teseo = require('teseo');
const analysis = require('./analysis');
const synthesis = require('./synthesis');
const logger = require('./logging');

const main = (schema, flavor, master, name) => {
  // Sort schema
  logger.info('Schema sorting started.');
  const sortedSchema = teseo.sort(schema, master, name);
  logger.info('Schema sorting finished succesfully.');

  // Execute analysis on schema object
  logger.info('Schema analysis started.');
  const analyzed = analysis(sortedSchema);
  if (analyzed.errorList.length > 0) {
    logger.error('The schema needs some attention!');
    analyzed.errorList.map(e => logger.error(JSON.stringify(e)));
    return '';
  }
  logger.info('Schema analysis finished succesfully.');

  // Generate SQL code from analyzed schema
  logger.info('Schema synthesis started.');
  const ddlCode = synthesis(analyzedSchema, flavor);
  logger.info('Schema synthesis finished succesfully.');

  return ddlCode;
};

module.exports = main;
