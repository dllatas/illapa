let errorList = [];

const indexType = ['unique', 'normal'];

const PROPS_TO_FILTER = ['_migration', 'exported'];

const checkPropName = (name, table, prop) => {
  if (!name) {
    errorList.push({
      msg: 'A column must have a name',
      table: table._table._name,
      prop,
    });
  }

  if (typeof name !== 'string') {
    errorList.push({
      msg: `A column name must be of type string. Currently, ${name} is type ${typeof name}`,
      table: table._table._name,
      prop,
    });
  }
};

const checkPropType = (type, table, prop) => {
  if (!type) {
    errorList.push({
      msg: 'A type must be defined for a column',
      table: table._table._name,
      prop,
    });
  }

  if (typeof type !== 'string') {
    errorList.push({
      msg: `A name must be of type string. Currently, ${type} is type ${typeof type}`,
      table: table._table._name,
      prop,
    });
  }
};

const checkPropSize = (size, table, prop) => {
  let sSize = String(size);

  // Check if sSize can be parsed into a number
  let formatForNumber = sSize;
  formatForNumber = formatForNumber.replace(',', '.');
  const parsedSize = Number(formatForNumber);
  if (Number.isNaN(parsedSize)) {
    errorList.push({
      msg: `Column size must be a valid number representation. Currently, ${parsedSize}`,
      table: table._table._name,
      prop,
    });
  }

  // Replace the dots by commas
  sSize = sSize.replace('.', ',');
  return sSize;
};

const checkPropDefaultValue = (defaultValue, table, prop) => {
  if (defaultValue && typeof defaultValue === 'string' && defaultValue !== 'NULL') {
    return `'${defaultValue}'`;
  }
  return defaultValue;
};

const checkColumn = (column, table, prop) => {
  const checkedColumn = column.map((c) => {
    checkPropName(c._name, table, prop);
    checkPropType(c._type, table, prop);
    c._length = checkPropSize(c._length, table, prop);
    c._default = checkPropDefaultValue(c._default, table, prop);
    return c;
  });
  return checkedColumn;
};

const checkPrimary = (value, table, prop) => {
  if (!Array.isArray(value)) {
    value = [value];
  }

  const columnNames = table._column.map(c => c._name);

  for (const v of value) {
    if (!columnNames.includes(v)) {
      errorList.push({
        msg: `The primary key should be a column on the table: ${v} is not one`,
        table: table._table._name,
        prop,
      });
    }
  }

  return value;
};

const checkIndex = (value, table, prop) => {
  const columnNames = table._column.map(c => c._name);

  // Check that array is not null
  if (!Array.isArray(value)) {
    value = [value];
  }

  for (const v of value) {
    // Check if name is string
    if (typeof v._name !== 'string') {
      errorList.push({
        msg: `The index name should be a string: ${v._name} (${typeof v._name})`,
        table: table._table._name,
        prop,
        name: v._name,
      });
    }

    // Check that index type is legal
    if (!indexType.includes(v._type)) {
      errorList.push({
        msg: `The index type is not defined: ${v._type}`,
        table: table._table._name,
        prop,
        name: v._name,
      });
    }

    // Check that all elements in column exist on column array
    for (const c of v._column) {
      if (!columnNames.includes(c)) {
        errorList.push({
          msg: `The index column should be a column on the table: ${c} is not one`,
          table: table._table._name,
          prop,
          name: v._name,
        });
      }
    }
  }

  return value;
};

const checkTable = (value, table, prop) => {
  if (typeof value._name !== 'string') {
    errorList.push({
      msg: `The table name must be a string. Instead table ${value._name} has a name of type ${typeof value._name}`,
      table: table._table._name,
      prop,
    });
  }

  if (!value._force) {
    delete value._force;
    return value;
  }

  if (typeof value._force !== 'boolean') {
    errorList.push({
      msg: `The table force must be a boolean. Instead table ${value._name} has a force of type ${typeof value._force}`,
      table: table._table._name,
      prop,
    });
  }

  return value;
};

const checkForeign = value => value;

const dispatcher = {
  _table: (value, table, prop) => checkTable(value, table, prop),
  _column: (value, table, prop) => checkColumn(value, table, prop),
  _primary: (value, table, prop) => checkPrimary(value, table, prop),
  _index: (value, table, prop) => checkIndex(value, table, prop),
  _foreign: (value, table, prop) => checkForeign(value, table, prop),
};

const analysis = (schema) => {
  errorList = [];
  const analyzedSchema = [];

  if (!Array.isArray(schema)) {
    schema = [schema];
  }
  schema = JSON.parse(JSON.stringify(schema));

  for (let i = 0; i < schema.length; i += 1) {
    const analyzedTable = {};
    const table = schema[i];
    const props = Object.keys(table).filter(k => !PROPS_TO_FILTER.includes(k));

    for (let j = 0; j < props.length; j += 1) {
      const analyzedProp = dispatcher[props[j]](table[props[j]], table, props[j]);
      if (analyzedProp) {
        analyzedTable[props[j]] = analyzedProp;
      }
    }
    analyzedSchema.push(analyzedTable);
  }

  return {
    schema: analyzedSchema,
    errorList,
  };
};

module.exports = analysis;
