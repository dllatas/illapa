const teseo = require('teseo');
const analysis = require('./analysis');
const synthesis = require('./synthesis');
const logger = require('./logging');

const main = (schema, flavor, master, name) => {
  // Execute analysis on schema object
  logger.info('Schema analysis started.');
  const analyzed = analysis(schema);
  if (analyzed.errorList.length > 0) {
    logger.error('The schema needs some attention!');
    analyzed.errorList.map(e => logger.error(JSON.stringify(e)));
    return '';
  }
  logger.info('Schema analysis finished succesfully.');

  // Sort schema
  logger.info('Schema sorting started.');
  const sortedSchema = teseo.sort(analyzed.schema, master, name);
  logger.info('Schema sorting finished succesfully.');

  // Generate SQL code from analyzed schema
  logger.info('Schema synthesis started.');
  const ddlCode = synthesis(sortedSchema, flavor);
  logger.info('Schema synthesis finished succesfully.');

  return ddlCode;
};

module.exports = main;
