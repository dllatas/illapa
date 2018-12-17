const analysis = {

  _indexType: [
    'unique',
    'normal'
  ],

  _checkPropName: function(name) {

    if (!name) {
      throw new Error('A name must be defined for a column');
    }

    if (typeof name !== 'string') {
      throw new Error('It must have be of type string');
    }

  },

  _checkPropType: function(type) {

    if (!type) {
      throw new Error('A type must be defined for a column');
    }

    if (typeof type !== 'string') {
      throw new Error('It must have be of type string');
    }

  },

  _checkPropLength: function(_length) {

    if (!_length) {
      throw new Error('A length must be defined for a column');
    }

    if (typeof _length === 'string') {
      _length = _length.replace(',', '.');
    }

    if (typeof _length !== 'number') {

      const parsedLength = Number(_length);

      if (isNaN(parsedLength)) {
        throw new Error('It must be of type number');
      }

    }
  },

  _setPropDefault: function(_default) {

    if( _default && typeof _default === 'string' && _default !== 'NULL' ) {
      return '\'' + _default + '\'';
    }

    return _default;
  },

  _checkColumn: function(value) {

    const _this = this;

    const analyzedColumn = value.map((v) => {
      _this._checkPropName(v._name);
      _this._checkPropType(v._type);
      _this._checkPropLength(v._length);
      v._default = _this._setPropDefault(v._default);

      return v;
    });

    return analyzedColumn;
  },

  _checkPrimary: function(value, table) {

    // Check that value if an array
    if (!Array.isArray(value)) {
      throw new Error('Primary key should be an array');
    }

    // Check that all elements in primary array exist on column array
    const columnNames = table._column.map(c => c._name);

    for (let v of value) {
      if (!columnNames.includes(v)) {
        throw new Error('The primary key should be a column on the table: ' + v + ' is not one' );
      }
    }

    return value;
  },

  _checkIndex: function(value, table) {

    const _this = this;
    const columnNames = table._column.map(c => c._name);

    // Check that array is not null
    if (!Array.isArray(value)) {
      throw new Error('Index should be an array');
    }

    for (let v of value) {

      // Check if name is string
      if (typeof v._name !== 'string') {
        throw new Error('The index name should be a string: ' + v._name + ' (' +  typeof v._name + ')');
      }

      // Check that index type is legal
      if (!_this._indexType.includes(v._type)) {
        throw new Error('The index type is not defined: ' + v._type);
      }

      // Check that all elements in column exist on column array
      for (let c of v._column) {
        if (!columnNames.includes(c)) {
          throw new Error('The index column should be a column on the table: ' + c + ' is not one' );
        }
      }

    }

    return value;
  },

  _checkTable: function(value) {

    if ( typeof value._name !== 'string' ) {
      throw new Error('The table name must be a string: '.concat(value._name).concat(' is of type ').concat(typeof value._name));
    }

    if (!value._force) {
      delete value._force;
      return value;
    }

    if ( typeof value._force !== 'boolean' ) {
      throw new Error('Force creating a table must be a boolean: '.concat(value._force).concat(' is of type ').concat(typeof value._force));
    }

    return value;
  },

  _checkForeign: function(value) {
    return value;
  },

  _checkPropDispatcher: {
    _table: function(value, table) {
      return this._checkTable(value, table);
    },
    _column: function(value, table) {
      return this._checkColumn(value, table);
    },
    _primary: function(value, table) {
      return this._checkPrimary(value, table);
    },
    _index: function(value, table) {
      return this._checkIndex(value, table);
    },
    _foreign: function(value, table) {
      return this._checkForeign(value, table);
    }
  },

  run: function(schema) {

    const _this = this;

    if (!Array.isArray(schema)) {
      schema = [schema];
    }

    let analyzedSchema = [];

    // Loop for different tables
    for (let table of schema) {

      let analyzedTable = {};
      const props = Object.keys(table);

      // Loop for settings on table
      for (let prop of props) {

        if (prop === '_migration') {
          continue;
        }

        const value = table[prop];

        // Start analysis
        const analyzedProp = _this._checkPropDispatcher[prop].bind(_this)(value, table);

        if (analyzedProp) {
          analyzedTable[prop] = analyzedProp;
        }
      }

      analyzedSchema.push(analyzedTable);
    }

    return analyzedSchema;
  }
};

module.exports = analysis.run.bind(analysis);
module.exports.analysis = analysis;
module.exports._checkColumn = analysis._checkColumn.bind(analysis);
module.exports._checkIndex = analysis._checkIndex.bind(analysis);