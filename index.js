var settings = {
  tableProps: [ '_column', '_primary', '_index', '_foreign' ],
};

// analysis
var analysis = {

  _checkMandatoryProps: function(props) {

    var message = 'Define basic properties for table definition! ';

    if (!(props._name && props._type && props._length)) {
      throw new Error(message + props._name + ' ' + JSON.stringify(props));
    }
  },

  _modifyDefaultProp: function(props) {

    if( props._default && typeof props._default === 'string' && props._default !== 'NULL' ) {
      props._default = '\'' + props._default + '\'';
    }

    return props;
  },

  _checkColumn: function(prop) {
		
    var _this = this;
    var column = prop._column;
    var columnChecked = column.map(function(c) {

      // Check types for each property
			
      // Check that each column has the mandatory props
      _this._checkMandatoryProps(c);

      // Check when default is a string and add \
      c = _this._modifyDefaultProp(c);
			
      return c;

    });

    return columnChecked;
  },
	
  _checkPrimary: function(prop) {

    var primary = prop._primary;
    // Check that array is not null
    // Check that all elements in primary array exist on column array
    return primary;
  },
	
  _checkIndex: function(prop) {
    var index = prop._index;
    // Check mandatory fields: type, name, fields
    // Check that type value is legal
    // Parse name to string
    // Check fields is an array and lenght is > 0 and fields exist in column array
    return index;
  },
	
  _checkForeign: function(prop) {
    var foreign = prop._foreign;
    return foreign;
  },
	
  _checkPropDispatcher: {
    _column:  function(prop) {
      return this._checkColumn(prop);
    },
    _primary: function(prop) {
      return this._checkPrimary(prop);
    },
    _index:   function(prop) {
      return this._checkIndex(prop);
    },
    _foreign: function(prop) {
      return this._checkForeign(prop);
    },
  },
	
  run: function(schema) {

    var _this = this;
    var tables = Object.keys(schema);

    var schemaParsed = tables.reduce(function(a, b) {

      var tableProps = settings.tableProps.reduce(function(c, prop) {
        var propAnalyzed = _this._checkPropDispatcher[prop].bind(_this)(schema[b]/*[prop]*/);
        if (propAnalyzed) {
          c[prop] = propAnalyzed;
        }
        return c;
      }, {});

      a[b] = tableProps;
      return a;
    }, {});

    return schemaParsed;
  }
};

var synthesis = {

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

var parser = {
	
  _run: function(schema) {

    // Execute analysis on schema object
    var analyzedSchema = analysis.run(schema);
    console.log('Schema analysis finished succesfully.');

    // Generate SQL code from analyzed schema
    var sqlCode = synthesis.run(analyzedSchema);
    console.log('Schema synthesis finished succesfully.');

    return sqlCode;
  },

  _helper: function(index, sqlCode, connection, verbose, error, results, fields) {

    if (error) {
      throw new Error(JSON.stringify(error) + JSON.stringify(results) + JSON.stringify(fields) + sqlCode[index]);
    }

    if (results && verbose) {
      console.log(JSON.stringify(results));
    }

    if (fields && verbose) {
      console.log(JSON.stringify(fields));
    }

    index++;

    if (index === sqlCode.length) {
      console.log('Schema building finished succesfully.');
      process.exit(0);
    }

    connection.query(sqlCode[index], this._helper.bind(this, index, sqlCode, connection, verbose));
  },

  _build: function(connection, schema, verbose) {
    var index = 0;
    var sqlCode = this._run(schema);
    connection.query(sqlCode[index], this._helper.bind(this, index, sqlCode, connection, verbose));
  }
};

var schemaBuilder = {
  run: parser._run.bind(parser),
  build: parser._build.bind(parser),
  //schema: require('./schema')
};

var test = {
  settings: settings,
  analysis: analysis,
  synthesis: synthesis,
  parser: parser
};

module.exports = schemaBuilder;
module.exports.test = test;