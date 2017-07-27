var schemaBuilder = require('./index');
var schema = require('./schema');
var connection = require('./connection');

schemaBuilder.build(connection, schema, false);