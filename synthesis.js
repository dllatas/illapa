const synthesis = {

  keywords: {
    _null:       [' NULL', ' NOT NULL'],
    _default:    [' DEFAULT ', ''],
    _increment:  [' AUTO_INCREMENT', ''],
  },
    
  indexPros: {
    _unique: 'UNIQUE INDEX ',
    _normal: 'INDEX '
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
        
    var _this = this;

    var indexSQL = props.reduce(function(a, b) {
      return a.concat(_this.indexPros[b._type] + b._name + '(' + b._fields.join() + '), ');
    }, '');

    return _this._sanitizeOutput(indexSQL);
  },

  generatePrimary: function(props) {
    return 'PRIMARY KEY (' + props.join() + ')';
  },
    
  generateForeign: function(props) {

    var _this = this;

    var foreignSQL = props.reduce(function(a, b) {
      var keys = Object.keys(b._fields);
      var hostColumns = keys.map(function(k){
        return b._fields[k];
      });
      var first = a.concat('CONSTRAINT ' + b._name + ' FOREIGN KEY(' + hostColumns.join() + ') ');
      var second = first.concat('REFERENCES ' + b._table + '(' + Object.keys(b._fields).join() + ')');
      return second + (_this.foreign.update[b._update] || '' ) + (_this.foreign.delete[b._delete] || '') + ', ';
    }, '');
        
    return _this._sanitizeOutput(foreignSQL);
  },

  operationDispatcher: {
    '_column' : function(props) {
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

  _generatePropCode: function(schema, tables) {

    var _this = this;

    // [ [ sql code for each prop of table ] ]
    var propCode = tables.map(function(table) {
      var columns = Object.keys(schema[table]);
      return columns.map(function(col) {
        return _this.operationDispatcher[col].bind(_this)(schema[table][col]);
      });
    });

    return propCode;
  },

  _generateTableCode: function(propCode, tables) {

    var _this = this;

    var tableCode = propCode.map(function(prop, tableIndex) {
			
      var tableDefintion  = prop.reduce(function(a, b) {
        return a.concat(b + ', ');
      }, '');

      return 'CREATE TABLE IF NOT EXISTS ' + tables[tableIndex] + '(' + _this._sanitizeOutput(tableDefintion) + ')';
    });
		
    return tableCode;
  },

  run: function(schema) {

    var _this = this;
    var tables = Object.keys(schema);

    var propCode = _this._generatePropCode(schema, tables);
    var tableCode = _this._generateTableCode(propCode, tables);

    return tableCode;
  }
};


module.exports = synthesis.run.bind(synthesis);