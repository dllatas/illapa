/*
global describe
global test
global expect
*/

const context = require('../schema/context');
const pillar = require('../schema/pillar');
const Analysis = require('./analysis');
const contextAnalyzed = Analysis(context);
const pillarAnalyzed = Analysis(pillar);
const Synthesis = require('./synthesis').synthesis;
const GenerateProp = require('./synthesis').generateProp;
const GenerateColumn = require('./synthesis').generateColumn;
const GenerateIndex = require('./synthesis').generateIndex;
const GenerateForeign = require('./synthesis').generateForeign;
const GeneratePropCode = require('./synthesis').generatePropCode;
const GenerateTableCode = require('./synthesis').generateTableCode;

describe('_keywords', () => {

  test('should be an object', () => {
    expect(Synthesis._keywords).toBeInstanceOf(Object);
  });

  test('should have keys: _null, _default, _increment', () => {
    expect(Synthesis._keywords).toHaveProperty('_null');
    expect(Synthesis._keywords).toHaveProperty('_default');
    expect(Synthesis._keywords).toHaveProperty('_increment');
  });

  test('_null key should values NULL and NOT NULL', () => {
    expect(Synthesis._keywords).toHaveProperty('_null', [' NULL', ' NOT NULL']);
  });

  test('_default key should values DEFAULT and BLANK SPACE', () => {
    expect(Synthesis._keywords).toHaveProperty('_default', [' DEFAULT ', '']);
  });

  test('_increment key should values AUTO_INCREMENT and BLANK SPACE', () => {
    expect(Synthesis._keywords).toHaveProperty('_increment',[' AUTO_INCREMENT', '']);
  });

});

describe('_indexPros', () => {

  test('should be an object', () => {
    expect(Synthesis._indexPros).toBeInstanceOf(Object);
  });

  test('should have keys: unique, normal', () => {
    expect(Synthesis._indexPros).toHaveProperty('unique');
    expect(Synthesis._indexPros).toHaveProperty('normal');
  });

  test('unique key should have value UNIQUE INDEX ', () => {
    expect(Synthesis._indexPros).toHaveProperty('unique', 'UNIQUE INDEX ');
  });

  test('normal key should have value INDEX ', () => {
    expect(Synthesis._indexPros).toHaveProperty('normal', 'INDEX ');
  });

});

describe('_foreign', () => {

  test('should be an object', () => {
    expect(Synthesis._foreign).toBeInstanceOf(Object);
  });

  test('should have keys: update, delete', () => {
    expect(Synthesis._foreign).toHaveProperty('update');
    expect(Synthesis._foreign).toHaveProperty('delete');
  });

  test('update key should have value object with property cascade and value ON UPDATE CASCADE', () => {
    expect(Synthesis._foreign).toHaveProperty('update', { cascade: ' ON UPDATE CASCADE' });
  });

  test('delete key should have value object with property cascade and value ON DELETE CASCADE', () => {
    expect(Synthesis._foreign).toHaveProperty('delete', { cascade: ' ON DELETE CASCADE' });
  });
});

describe('_generateProp', () => {

  test('should append a value when type of prop is boolean and prop is true', () => {
    expect(GenerateProp('_default', contextAnalyzed[0]._column[2]._default)).toBe(" DEFAULT 'S'");
  });

  test('should return a value when true', () => {
    expect(GenerateProp('_null', true)).toBe(' NULL');
  });

  test('should return another value when false', () => {
    expect(GenerateProp('_null', false)).toBe(' NOT NULL');
  });

});

describe('_sanitizeOutput', () => {

  test('should throw an error when input type is not string', () => {
    expect(() => { Synthesis._sanitizeOutput(5); }).toThrow();
  });

  test('should return the input without the last 2 characters', () => {
    expect(Synthesis._sanitizeOutput('jenny')).toBe('jen');
  });

});

describe('_generateColumn', () => {

  const output = GenerateColumn(contextAnalyzed[0]._column);

  test('should return a string', () => {
    expect(typeof output).toBe('string');
  });

  test('should generate a string with SQL code including complement for columns definition', () => {
    expect(output).toBe("id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL, digest VARCHAR(10) NOT NULL DEFAULT 'S'");
  });

});

describe('_generateIndex', () => {

  const output = GenerateIndex(contextAnalyzed[0]._index);

  test('should return a string', () => {
    expect(typeof output).toBe('string');
  });
  
  test('should generate a string with SQL code for index definition', () => {
    expect(output).toBe('UNIQUE INDEX idx_uq_name(name), UNIQUE INDEX idx_uq_abv(digest)');
  });

});

describe('_generatePrimary', () => {

  const output = Synthesis._generatePrimary(contextAnalyzed[0]._primary);

  test('should return a string', () => {
    expect(typeof output).toBe('string');
  });
  
  test('should generate a string with SQL code for primary key definition', () => {
    expect(output).toBe('PRIMARY KEY (id)');
  });

});

describe('_generateForeign', () => {

  const output = GenerateForeign(pillarAnalyzed[0]._foreign);

  test('should return a string', () => {
    expect(typeof output).toBe('string');
  });

  test('should generate a string with SQL code for foreign key definition', () => {
    expect(output).toBe('CONSTRAINT fk_pillar_context FOREIGN KEY(context_id) REFERENCES context(id) ON UPDATE CASCADE ON DELETE CASCADE');
  });

  /*test('should generate a string with SQL code for UPDATE ON CASCADE', () => {
    expect();
  });

  test('should generate a string with SQL code for DELETE ON CASCADE', () => {
    expect();
  });*/

});

describe('_generateName', () => {

  const output = Synthesis._generateName(contextAnalyzed[0]._name);

  test('should return a string', () => {
    expect(typeof output).toBe('string');
  });

  test('should generate a string with SQL code for table name', () => {
    expect(output).toBe('CREATE TABLE IF NOT EXISTS context');
  });

});

describe('_operationDispatcher', () => {

  test('should be an object', () => {
    expect(Synthesis._operationDispatcher).toBeInstanceOf(Object);
  });

  test('should have keys: _name, _column, _primary, _index, _foreign', () => {
    expect(Synthesis._operationDispatcher).toHaveProperty('_name');
    expect(Synthesis._operationDispatcher).toHaveProperty('_column');
    expect(Synthesis._operationDispatcher).toHaveProperty('_primary');
    expect(Synthesis._operationDispatcher).toHaveProperty('_index');
    expect(Synthesis._operationDispatcher).toHaveProperty('_foreign');
  });

});

describe('_generatePropCode', () => {

  const result = [{ 
    _name: 'CREATE TABLE IF NOT EXISTS context',
    _column: 'id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL, digest VARCHAR(10) NOT NULL DEFAULT \'S\'',
    _primary: 'PRIMARY KEY (id)',
    _index: 'UNIQUE INDEX idx_uq_name(name), UNIQUE INDEX idx_uq_abv(digest)'
  }];

  test('should accept objects as an input too', () => {
    const output = GeneratePropCode(contextAnalyzed[0]);
    expect(JSON.stringify(output)).toBe(JSON.stringify(result));
  });

  test('should return an array', () => {
    const output = GeneratePropCode(contextAnalyzed);
    expect(output).toBeInstanceOf(Array);
  });

});

describe('_generateTableCode', () => {

  const result = ['CREATE TABLE IF NOT EXISTS context(id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL, digest VARCHAR(10) NOT NULL DEFAULT \'S\', PRIMARY KEY (id), UNIQUE INDEX idx_uq_name(name), UNIQUE INDEX idx_uq_abv(digest))'];

  test('should accept objects as an input too', () => {
    let output = GeneratePropCode(contextAnalyzed[0]);
    output = GenerateTableCode(output[0]);
    expect(JSON.stringify(output)).toBe(JSON.stringify(result));
  });

  test('should return a string (SQL Code)', () => {
    let output = GeneratePropCode(contextAnalyzed);
    output = GenerateTableCode(output);
    console.log(typeof output);
    expect(typeof output).toBe('object');
  });

});