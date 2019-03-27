let postBuffer = [];

const _extraOrder = {
  pg: ['_increment', '_null', '_default'],
  mysql: ['_null', '_default', '_increment'],
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
  /*if (typeof output !== 'string') {
    throw new Error('Output must be a string');
  }*/
  return output.substr(0, (output.length - 2));
};

const generateColumnBasic = (flavor, column) => {
  const flavors = {
    pg: {
      INT: column._increment ? `${column._name}` : `${column._name} ${column._type}`,
      VARCHAR: `${column._name} ${column._type}(${column._length})`,
      DOUBLE: `${column._name} numeric (${column._length})`,
    },
    mysql: {
      INT: `${column._name} ${column._type}(${column._length})`,
      VARCHAR: `${column._name} ${column._type}(${column._length})`,
      DOUBLE: `${column._name} ${column._type}(${column._length})`,
    },
  };

  return flavors[flavor][column._type];
};

const generetaExtra = (flavor, key, value) => {
  const flavors = {
    pg: {
      _null: (t, v) => v ? ' NULL' : ' NOT NULL',
      _default: (t, v) => (t !== 'boolean' && v) ? ` DEFAULT ${v}` : '',
      _increment: (t, v) => v ? ' SERIAL' : '',
    },
    mysql: {
      _null: (t, v) => v ? ' NULL' : ' NOT NULL',
      _default: (t, v) => (t !== 'boolean' && v) ? ` DEFAULT ${v}` : '',
      _increment: (t, v) => v ? ' AUTO_INCREMENT' : '',
    },
  };
  const extra = flavors[flavor][key](typeof value, value);
  return extra;
};

const generateColumnExtra = (flavor, column) => _extraOrder[flavor].reduce(
  (acc, columnKey) => {
    acc = `${acc}${generetaExtra(flavor, columnKey, column[columnKey])}`;
    return acc;
  }, '',
);

const generateIndexSingle = (flavor, index, table) => {
  const flavors = {
    pg: {
      unique: idx => `CONSTRAINT ${idx._name} UNIQUE (${idx._column.join()}), `,
      normal: (idx, t) => {
        const indexSQL = `CREATE INDEX ${idx._name} ON ${t._table._name} (${index._column.join()});`;
        postBuffer.push(indexSQL);
        return '';
      },
    },
    mysql: {
      unique: idx => `UNIQUE INDEX ${idx._name}(${idx._column.join()}), `,
      normal: idx => `INDEX ${idx._name}(${idx._column.join()}), `,
    },
  };
  return flavors[flavor][index._type](index, table);
};

const generateForeignSingle = (flavor, foreign, table) => {
  const foreignColumns = Object.keys(foreign._column);
  const columns = foreignColumns.map(fc => foreign._column[fc]);

  const updateRule = (_foreign.update[foreign._update] || '');
  const deleteRule = (_foreign.delete[foreign._delete] || '');

  if (table._table._name === foreign._table) {
    const alter = {
      pg: `ALTER TABLE ${foreign._table} ADD CONSTRAINT ${foreign._name} FOREIGN KEY (${columns.join()}) REFERENCES ${foreign._table} (${foreignColumns.join()}) ${deleteRule} ${updateRule}, `,
      mysql: `ALTER TABLE ${foreign._table} ADD CONSTRAINT ${foreign._name} FOREIGN KEY (${columns.join()}) REFERENCES ${foreign._table} (${foreignColumns.join()}) ${deleteRule} ${updateRule}, `,
    };
    postBuffer.push(sanitize(alter[flavor]) + ';');
    return '';
  }

  const flavors = {
    pg: `CONSTRAINT ${foreign._name} FOREIGN KEY (${columns.join()}) REFERENCES ${foreign._table} (${foreignColumns.join()}) ${deleteRule} ${updateRule}, `,
    mysql: `CONSTRAINT ${foreign._name} FOREIGN KEY (${columns.join()}) REFERENCES ${foreign._table} (${foreignColumns.join()}) ${updateRule} ${deleteRule}, `,
  };

  const foreignSQL = flavors[flavor];
  return foreignSQL;
};

// Dispatch actions BEGIN
const generateForeign = (flavor, foreignKeys, table) => {
  const foreignSQL = foreignKeys.reduce((acc, foreignKey) => {
    acc = acc + generateForeignSingle(flavor, foreignKey, table);
    return acc;
  }, '');
  return sanitize(foreignSQL);
};

const generateIndex = (flavor, indexList, table) => {
  const indexSQL = indexList.reduce((acc, index) => {
    acc = acc + generateIndexSingle(flavor, index, table);
    return acc;
  }, '');
  return sanitize(indexSQL);
};

const generatePrimary = (flavor, primary) => {
  const flavors = {
    pg: `PRIMARY KEY (${primary.join(', ')})`,
    mysql: `PRIMARY KEY (${primary.join(', ')})`,
  };
  return flavors[flavor];
};

const generateColumn = (flavor, columns) => {
  const columnsSQL = columns.reduce((acc, column) => {
    acc = acc + generateColumnBasic(flavor, column) + generateColumnExtra(flavor, column) + ', ';
    return acc;
  }, '');
  return sanitize(columnsSQL);
};

const generateTable = (flavor, prop) => {
  const flavors = {
    pg: prop._force ? `CREATE TABLE ${prop._name}` : `CREATE TABLE IF NOT EXISTS ${prop._name}`,
    mysql: prop._force ? `CREATE TABLE ${prop._name}` : `CREATE TABLE IF NOT EXISTS ${prop._name}`,
  };
  return flavors[flavor];
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

  /*if (!Array.isArray(decodedSchema)) {
    decodedSchema = [decodedSchema];
  }*/

  for (const table of decodedSchema) {
    const props = Object.keys(table).filter(p => p !== TABLE_PROP);
    const tableDefintion = props.reduce((acc, prop) => {
      acc = acc + (table[prop].length === 0 ? '' : `${table[prop]}, `);
      return acc;
    }, '');
    ddl.push(`${table[TABLE_PROP]} (${sanitize(tableDefintion)});`);
  }

  // Load buffer
  const result = [...ddl, ...postBuffer];

  return result;
};

const synthesis = (schema, flavor = 'pg') => {
  postBuffer = [];
  const decodedSchema = decodeSchema(schema, flavor);
  const ddl = merge(decodedSchema, flavor);
  return ddl;
};

module.exports = synthesis;
