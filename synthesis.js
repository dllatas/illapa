const synthesis = {

  keywords: {
    _null:       [' NULL', ' NOT NULL'],
    _default:    [' DEFAULT ', ''],
    _increment:  [' AUTO_INCREMENT', ''],
  },
    
  indexPros: {
    unique: 'UNIQUE INDEX ',
    normal: 'INDEX '
  },
    
  foreign: {
    update: {
      cascade: ' ON UPDATE CASCADE',
    },
    delete: {
      cascade: ' ON DELETE CASCADE',
    }
  },

  generateProp: function(prop, propValue) {
        
    if (typeof propValue !== 'boolean') {
      return propValue ? this.keywords[prop][0] + propValue : this.keywords[prop][1];
    }
        
    return propValue ? this.keywords[prop][0] : this.keywords[prop][1];
  },

  _sanitizeOutput: function(output) {
		
    if (typeof output !== 'string') {
      throw new Error('Output must be a string');
    }
		
    return output.substr(0, (output.length - 2));
  },

  generateColumn: function(props) {
		
    var _this = this; 
    var propNames = Object.keys(_this.keywords);

    var columnSQL = props.reduce(function(a, b) {
      var complement = propNames.reduce(function(c, d) {
        return c.concat(_this.generateProp(d, b[d]));
      }, '');
      return a.concat(b._name + ' ' + b._type + '(' + b._length + ')' + complement + ', ');
    }, '');

    return _this._sanitizeOutput(columnSQL);
  },
    
  generateIndex: function(props) {
        
    const _this = this;

    const indexSQL = props.reduce(function(a, b) {
      return a.concat(_this.indexPros[b._type] + b._name + '(' + b._column.join() + '), ');
    }, '');

    return _this._sanitizeOutput(indexSQL);
  },

  generatePrimary: function(props) {
    return 'PRIMARY KEY (' + props.join() + ')';
  },
    
  generateForeign: function(props) {

    var _this = this;

    var foreignSQL = props.reduce(function(a, b) {
      var keys = Object.keys(b._column);
      var hostColumns = keys.map(function(k){
        return b._column[k];
      });
      var first = a.concat('CONSTRAINT ' + b._name + ' FOREIGN KEY(' + hostColumns.join() + ') ');
      var second = first.concat('REFERENCES ' + b._table + '(' + Object.keys(b._column).join() + ')');
      return second + (_this.foreign.update[b._update] || '' ) + (_this.foreign.delete[b._delete] || '') + ', ';
    }, '');
        
    return _this._sanitizeOutput(foreignSQL);
  },

  generateName: function(value) {
    return 'CREATE TABLE IF NOT EXISTS ' + value;
  },

  operationDispatcher: {
    '_name': function(value) {
      return this.generateName(value);
    },
    '_column': function(props) {
      return this.generateColumn(props);
    },
    '_primary': function(props) {
      return this.generatePrimary(props);
    },
    '_index': function(props) {
      return this.generateIndex(props);
    },
    '_foreign': function(props) {
      return this.generateForeign(props);
    } 
  },

  _generatePropCode: function(schema) {

    const _this = this;
    let generatedSchema = [];

    for (let table of schema) {
      
      const props = Object.keys(table);
      let generatedProp = {};

      for (let prop of props) {
        const value = table[prop];
        generatedProp[prop] = _this.operationDispatcher[prop].bind(_this)(value);
      }

      generatedSchema.push(generatedProp);
    }

    return generatedSchema;
  },

  _generateTableCode: function(partialSchema) {

    const _this = this;
    let tableCode = [];

    for (let table of partialSchema) {

      const props = Object.keys(table).filter(p => p !== '_name');

      const tableDefintion = props.reduce((a, b) => {
        return a.concat(table[b] + ', ');
      }, '');

      tableCode.push(table._name + '(' + _this._sanitizeOutput(tableDefintion) + ')');
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