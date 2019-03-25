const indexType = [
  'unique',
  'normal',
];

const checkPropName = (name) => {
  if (!name) {
    throw new Error('A name must be defined for a column');
  }

  if (typeof name !== 'string') {
    throw new Error('It must have be of type string');
  }
};

const checkPropType = (type) => {
  if (!type) {
    throw new Error('A type must be defined for a column');
  }

  if (typeof type !== 'string') {
    throw new Error('It must have be of type string');
  }
};

const checkPropSize = (size) => {
  if (typeof size === 'string') {
    size = size.replace(',', '.');
  }

  if (typeof size !== 'number') {
    const parsedSize = Number(size);
    if (Number.isNaN(parsedSize)) {
      throw new Error('The size of a column must be of type number');
    }
  }
};

const checkPropDefaultValue = (defaultValue) => {
  if (defaultValue && typeof defaultValue === 'string' && defaultValue !== 'NULL') {
    return `'${defaultValue}'`;
  }
  return defaultValue;
};

const checkColumn = (column) => {
  const checkedColumn = column.map((c) => {
    checkPropName(c._name);
    checkPropType(c._type);
    checkPropSize(c._length);
    c._default = checkPropDefaultValue(c._default);
    return c;
  });
  return checkedColumn;
};

const checkPrimary = (value, table) => {
  // Check that value if an array
  if (!Array.isArray(value)) {
    throw new Error('Primary key should be an array');
  }

  // Check that all elements in primary array exist on column array
  const columnNames = table._column.map(c => c._name);

  for (const v of value) {
    if (!columnNames.includes(v)) {
      throw new Error(`The primary key should be a column on the table: ${v} is not one`);
    }
  }

  return value;
};

const checkIndex = (value, table) => {
  const columnNames = table._column.map(c => c._name);

  // Check that array is not null
  if (!Array.isArray(value)) {
    throw new Error('Index should be an array');
  }

  for (const v of value) {
    // Check if name is string
    if (typeof v._name !== 'string') {
      throw new Error(`The index name should be a string: ${v._name} (${typeof v._name})`);
    }

    // Check that index type is legal
    if (!indexType.includes(v._type)) {
      throw new Error(`The index type is not defined: ${v._type}`);
    }

    // Check that all elements in column exist on column array
    for (const c of v._column) {
      if (!columnNames.includes(c)) {
        throw new Error(`The index column should be a column on the table: ${c} is not one`);
      }
    }
  }

  return value;
};

const checkTable = (value) => {
  if (typeof value._name !== 'string') {
    throw new Error(`The table name must be a string. Instead table ${value._name} has a name of type ${typeof value._name}`);
  }

  if (!value._force) {
    delete value._force;
    return value;
  }

  if (typeof value._force !== 'boolean') {
    throw new Error(`The table force must be a boolean. Instead table ${value._name} has a force of type ${typeof value._force}`);
  }

  return value;
};

const checkForeign = value => value;

const dispatcher = {
  _table: (value, table) => checkTable(value, table),
  _column: (value, table) => checkColumn(value, table),
  _primary: (value, table) => checkPrimary(value, table),
  _index: (value, table) => checkIndex(value, table),
  _foreign: (value, table) => checkForeign(value, table),
};

const analysis = schema => {
  const analyzedSchema = [];

  if (!Array.isArray(schema)) {
    schema = [schema];
  }

  // Loop for different tables
  for (const table of schema) {
    const analyzedTable = {};
    const props = Object.keys(table).filter(k => !['_migration', 'exported'].includes(k));

    // Start analysis by loop for props on table object
    for (const prop of props) {
      const analyzedProp = dispatcher[prop](table[prop], table);
      if (analyzedProp) {
        analyzedTable[prop] = analyzedProp;
      }
    }

    analyzedSchema.push(analyzedTable);
  }

  return analyzedSchema;
};

module.exports = analysis;
