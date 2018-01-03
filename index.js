const Analysis = require('./analysis');
const Synthesis = require('./synthesis');

const builder = {
	
  _run: function(schema) {

    // Execute analysis on schema object
    const analyzedSchema = Analysis(schema);
    console.log('Schema analysis finished succesfully.');

    // Generate SQL code from analyzed schema
    const sqlCode = Synthesis(analyzedSchema);
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

const schemaBuilder = {
  run: builder._run.bind(builder),
  build: builder._build.bind(builder),
};

module.exports = schemaBuilder;