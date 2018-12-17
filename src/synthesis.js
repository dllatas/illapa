const synthesis = {

  _keywords: {
    _null:       [' NULL', ' NOT NULL'], // TODO: use SET
    _default:    [' DEFAULT ', ''],
    _increment:  [' AUTO_INCREMENT', ''],
  },

  _indexPros: {
    unique: 'UNIQUE INDEX ',
    normal: 'INDEX '
  },

  _foreign: {
    update: {
      cascade: ' ON UPDATE CASCADE',
      no_action: ' ON UPDATE NO ACTION',
      _null: ' ON UPDATE SET NULL',
      _default: ' ON UPDATE SET DEFAULT'
    },
    delete: {
      cascade: ' ON DELETE CASCADE',
      no_action: ' ON DELETE NO ACTION',
      _null: ' ON DELETE SET NULL',
      _default: ' ON DELETE SET DEFAULT'
    }
  },

  _generateProp: function(prop, propValue) {

    if (typeof propValue !== 'boolean') {
      return propValue ? this._keywords[prop][0] + propValue : this._keywords[prop][1];
    }

    return propValue ? this._keywords[prop][0] : this._keywords[prop][1];
  },

  _sanitizeOutput: function(output) {

    if (typeof output !== 'string') {
      throw new Error('Output must be a string');
    }

    return output.substr(0, (output.length - 2));
  },

  _generateColumn: function(props) {

    const _this = this;
    const propNames = Object.keys(_this._keywords);

    const columnSQL = props.reduce(function(a, b) {
      const complement = propNames.reduce(function(c, d) {
        return c.concat(_this._generateProp(d, b[d]));
      }, '');
      return a.concat(b._name + ' ' + b._type + '(' + b._length + ')' + complement + ', ');
    }, '');

    return _this._sanitizeOutput(columnSQL);
  },

  _generateIndex: function(props) {

    const _this = this;

    const indexSQL = props.reduce(function(a, b) {
      return a.concat(_this._indexPros[b._type] + b._name + '(' + b._column.join() + '), ');
    }, '');

    return _this._sanitizeOutput(indexSQL);
  },

  _generatePrimary: function(props) {
    return 'PRIMARY KEY (' + props.join() + ')';
  },

  _generateForeign: function(props) {

    const _this = this;

    const foreignSQL = props.reduce(function(a, b) {
      const keys = Object.keys(b._column);
      const hostColumns = keys.map(function(k){
        return b._column[k];
      });
      let first = a.concat('CONSTRAINT ' + b._name + ' FOREIGN KEY(' + hostColumns.join() + ') ');
      const second = first.concat('REFERENCES ' + b._table + '(' + Object.keys(b._column).join() + ')');
      return second + (_this._foreign.update[b._update] || '' ) + (_this._foreign.delete[b._delete] || '') + ', ';
    }, '');

    return _this._sanitizeOutput(foreignSQL);
  },

  _generateTable: function(value) {

    if (value._force) {
      return 'CREATE TABLE ' + value._name;

    }

    return 'CREATE TABLE IF NOT EXISTS ' + value._name;
  },

  _operationDispatcher: {
    '_table': function(value) {
      return this._generateTable(value);
    },
    '_column': function(props) {
      return this._generateColumn(props);
    },
    '_primary': function(props) {
      return this._generatePrimary(props);
    },
    '_index': function(props) {
      return this._generateIndex(props);
    },
    '_foreign': function(props) {
      return this._generateForeign(props);
    }
  },

  _generatePropCode: function(schema) {

    const _this = this;
    let generatedSchema = [];

    if (!Array.isArray(schema)) {
      schema = [schema];
    }

    for (let table of schema) {

      const props = Object.keys(table);
      let generatedProp = {};

      for (let prop of props) {

        const value = table[prop];
        generatedProp[prop] = _this._operationDispatcher[prop].bind(_this)(value);
      }

      generatedSchema.push(generatedProp);
    }

    return generatedSchema;
  },

  _generateTableCode: function(partialSchema) {

    const _this = this;
    let tableCode = [];

    if (!Array.isArray(partialSchema)) {
      partialSchema = [partialSchema];
    }

    for (let table of partialSchema) {

      const props = Object.keys(table).filter(p => p !== '_table');
      const _table = Object.keys(table).filter(p => p === '_table');

      const tableDefintion = props.reduce((a, b) => {
        return a.concat(table[b] + ', ');
      }, '');

      tableCode.push(table[_table] + '(' + _this._sanitizeOutput(tableDefintion) + ')');
    }

    return tableCode;
  },

  run: function(schema) {

    const _this = this;

    const partialSchema = _this._generatePropCode(schema);
    const tableCode = _this._generateTableCode(partialSchema);

    return tableCode;
  }
};


module.exports = synthesis.run.bind(synthesis);
module.exports.synthesis = synthesis;
module.exports.generateProp = synthesis._generateProp.bind(synthesis);
module.exports.generateColumn = synthesis._generateColumn.bind(synthesis);
module.exports.generateIndex = synthesis._generateIndex.bind(synthesis);
module.exports.generateForeign = synthesis._generateForeign.bind(synthesis);
module.exports.generatePropCode = synthesis._generatePropCode.bind(synthesis);
module.exports.generateTableCode = synthesis._generateTableCode.bind(synthesis);