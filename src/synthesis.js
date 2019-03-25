const _keywords = {
  _null: [' NULL', ' NOT NULL'],
  _default: [' DEFAULT ', ''],
  _increment: [' AUTO_INCREMENT', ''],
};

const _indexPros = {
  unique: 'UNIQUE INDEX ',
  normal: 'INDEX ',
};

const _foreign = {
  update: {
    cascade: ' ON UPDATE CASCADE',
    no_action: ' ON UPDATE NO ACTION',
    _null: ' ON UPDATE SET NULL',
    _default: ' ON UPDATE SET DEFAULT',
  },
  delete: {
    cascade: ' ON DELETE CASCADE',
    no_action: ' ON DELETE NO ACTION',
    _null: ' ON DELETE SET NULL',
    _default: ' ON DELETE SET DEFAULT',
  },
};

const sanitize = (output) => {
  if (typeof output !== 'string') {
    throw new Error('Output must be a string');
  }
  return output.substr(0, (output.length - 2));
};

const generateProp = (prop, propValue) => {
  if (typeof propValue !== 'boolean') {
    return propValue ? _keywords[prop][0] + propValue : _keywords[prop][1];
  }
  return propValue ? _keywords[prop][0] : _keywords[prop][1];
};

// Dispatch actions BEGIN
const generateForeign = (flavor, props) => {
  const foreignSQL = props.reduce((acc, prop) => {
    const keys = Object.keys(prop._column);
    const hostColumns = keys.map(k => prop._column[k]);
    const first = acc.concat(`CONSTRAINT ${prop._name} FOREIGN KEY(${hostColumns.join()}) `);
    const second = first.concat(`REFERENCES ${prop._table}(${Object.keys(prop._column).join()})`);
    return `${second} ${(_foreign.update[prop._update] || '')} ${(_foreign.delete[prop._delete] || '')}, `;
  }, '');
  return sanitize(foreignSQL);
};

const generateIndex = (flavor, props) => {
  const indexSQL = props.reduce((acc, prop) => {
    acc = acc.concat(`${_indexPros[prop._type]}${prop._name}(${prop._column.join()}), `);
    return acc;
  }, '');
  return sanitize(indexSQL);
};

const generatePrimary = (flavor, prop) => {
  const primarySQL = `PRIMARY KEY (${prop.join(', ')})`;
  return primarySQL;
};

const generateColumn = (flavor, propList) => {
  const propNames = Object.keys(_keywords);

  const columnSQL = propList.reduce((acc, prop) => {
    const complement = propNames.reduce((comp, propName) => {
      const generatedProp = generateProp(propName, prop[propName]);
      return comp.concat(generatedProp);
    }, '');
    return acc.concat(`${prop._name} ${prop._type}(${prop._length})${complement}, `);
  }, '');

  return sanitize(columnSQL);
};

const generateTable = (flavor, prop) => {
  const options = {
    pg: prop._force ? `CREATE TABLE ${prop._name}` : `CREATE TABLE IF NOT EXISTS ${prop._name}`,
    mysql: prop._force ? `CREATE TABLE ${prop._name}` : `CREATE TABLE IF NOT EXISTS ${prop._name}`,
  };
  return options[flavor];
};

// Dispatch actions END

const dispatcher = {
  _table: (flavor, prop, table, schema) => generateTable(flavor, prop, table, schema),
  _column: (flavor, prop, table, schema) => generateColumn(flavor, prop, table, schema),
  _primary: (flavor, prop, table, schema) => generatePrimary(flavor, prop, table, schema),
  _index: (flavor, prop, table, schema) => generateIndex(flavor, prop, table, schema),
  _foreign: (flavor, prop, table, schema) => generateForeign(flavor, prop, table, schema),
};

const decodeSchema = (schema, flavor) => {
  const decodedSchema = [];

  if (!Array.isArray(schema)) {
    schema = [schema];
  }

  for (const table of schema) {
    const props = Object.keys(table);
    const decodedProp = {};
    for (const prop of props) {
      decodedProp[prop] = dispatcher[prop](flavor, table[prop], table, schema);
    }
    decodedSchema.push(decodedProp);
  }

  return decodedSchema;
};

const merge = (decodedSchema) => {
  const ddl = [];
  const TABLE_PROP = '_table';

  if (!Array.isArray(decodedSchema)) {
    decodedSchema = [decodedSchema];
  }

  for (const table of decodedSchema) {
    const props = Object.keys(table).filter(p => p !== TABLE_PROP);
    const tableDefintion = props.reduce((acc, prop) => acc.concat(`${table[prop]}, `), '');


    ddl.push(`${table[TABLE_PROP]} (${sanitize(tableDefintion)})`);
  }
  return ddl;
};

const synthesis = (schema, flavor = 'pg') => {
  const decodedSchema = decodeSchema(schema, flavor);
  //console.log(decodedSchema);
  const ddl = merge(decodedSchema, flavor);
  return ddl;
};

module.exports = synthesis;
