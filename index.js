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
  }

};

const schemaBuilder = {
  run: builder._run.bind(builder),
};

module.exports = schemaBuilder;