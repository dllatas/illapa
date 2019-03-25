const { describe, it } = require('mocha');
const { assert } = require('chai');
const {
  synthesis,
  generateProp,
  generatePropCode,
  generateTableCode,
} = require('../src/synthesis');

describe('test suite for synthesis module', () => {
  const contextAnalyzed = [{
    _column: 'id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL, digest VARCHAR(10) NOT NULL DEFAULT \'\'S\'\'',
  }];

  describe('_keywords', () => {
    it('should be an object', () => {
      assert.strictEqual(typeof synthesis._keywords, 'object');
    });

    it('should have keys: _null, _default, _increment', () => {
      assert.ok(synthesis._keywords._null);
      assert.ok(synthesis._keywords._default);
      assert.ok(synthesis._keywords._increment);
    });

    it('_null key should values NULL and NOT NULL', () => {
      assert.strictEqual(synthesis._keywords._null[0], ' NULL');
      assert.strictEqual(synthesis._keywords._null[1], ' NOT NULL');
    });

    it('_default key should values DEFAULT and BLANK SPACE', () => {
      assert.strictEqual(synthesis._keywords._default[0], ' DEFAULT ');
      assert.strictEqual(synthesis._keywords._default[1], '');
    });

    it('_increment key should values AUTO_INCREMENT and BLANK SPACE', () => {
      assert.strictEqual(synthesis._keywords._increment[0], ' AUTO_INCREMENT');
      assert.strictEqual(synthesis._keywords._increment[1], '');
    });
  });

  describe('_indexPros', () => {
    it('should be an object', () => {
      assert.strictEqual(typeof synthesis._indexPros, 'object');
    });

    it('should have keys: unique, normal', () => {
      assert.ok(synthesis._indexPros.unique);
      assert.ok(synthesis._indexPros.normal);
    });

    it('unique key should have value UNIQUE INDEX ', () => {
      assert.strictEqual(synthesis._indexPros.unique, 'UNIQUE INDEX ');
    });

    it('normal key should have value INDEX ', () => {
      assert.strictEqual(synthesis._indexPros.normal, 'INDEX ');
    });
  });

  describe('_foreign', () => {
    it('should be an object', () => {
      assert.strictEqual(typeof synthesis._foreign, 'object');
    });

    it('should have keys: update, delete', () => {
      assert.ok(synthesis._foreign.update);
      assert.ok(synthesis._foreign.delete);
    });

    it('update key should have value object with property cascade and value ON UPDATE CASCADE', () => {
      assert.deepStrictEqual(synthesis._foreign.update, {
        cascade: ' ON UPDATE CASCADE',
        no_action: ' ON UPDATE NO ACTION',
        _null: ' ON UPDATE SET NULL',
        _default: ' ON UPDATE SET DEFAULT',
      });
    });

    it('delete key should have value object with property cascade and value ON DELETE CASCADE', () => {
      assert.deepStrictEqual(synthesis._foreign.delete, {
        cascade: ' ON DELETE CASCADE',
        no_action: ' ON DELETE NO ACTION',
        _null: ' ON DELETE SET NULL',
        _default: ' ON DELETE SET DEFAULT',
      });
    });
  });

  describe('_generateProp', () => {
    it('should append a value when type of prop is boolean and prop is true', () => {
      const input = generateProp('_default', contextAnalyzed[0]._column[2]._default);
      assert.strictEqual(input, ' DEFAULT \'\'\'S\'\'\'');
    });

    it('should return a value when true', () => {
      const input = generateProp('_null', true);
      assert.strictEqual(input, ' NULL');
    });

    it('should return another value when false', () => {
      const input = generateProp('_null', false);
      assert.strictEqual(input, ' NOT NULL');
    });
  });

  describe('_sanitizeOutput', () => {
    it('should throw an error when input type is not string', () => {
      assert.throws(() => { synthesis._sanitizeOutput(5); });
    });

    it('should return the input without the last 2 characters', () => {
      const input = synthesis._sanitizeOutput('jenny');
      assert.strictEqual(input, 'jen');
    });
  });


  /* describe('_generateColumn', () => {
    const output = generateColumn(contextAnalyzed[0]._column);

    it('should return a string', () => {
      assert.strictEqual(typeof output, 'string');
    });

    it('should generate a string with SQL code including complement for columns definition', () => {
      assert.strictEqual(
        output,
        `id INT(11) NOT NULL AUTO_INCREMENT,
         name VARCHAR(100) NOT NULL,
         digest VARCHAR(10) NOT NULL DEFAULT \'\'S\'\'`);
    });
  });

  describe('_generateIndex', () => {
    const output = generateIndex(contextAnalyzed[0]._index);

    it('should return a string', () => {
      assert.deepStrictEqual(typeof output, 'string');
    });

    it('should generate a string with SQL code for index definition', () => {
      assert.deepStrictEqual(
        output,
        'UNIQUE INDEX idx_uq_name(name), UNIQUE INDEX idx_uq_abv(digest)');
    });
  });

  describe('_generatePrimary', () => {
    const output = synthesis._generatePrimary(contextAnalyzed[0]._primary);

    it('should return a string', () => {
      assert.strictEqual(typeof output, 'string');
    });

    it('should generate a string with SQL code for primary key definition', () => {
      assert.strictEqual(output, 'PRIMARY KEY (id)');
    });
  });

  describe('_generateForeign', () => {
    const output = generateForeign(pillarAnalyzed[0]._foreign);

    it('should return a string', () => {
      assert.strictEqual(typeof output, 'string');
    });

    it('should generate a string with SQL code for foreign key definition', () => {
      assert.strictEqual(
        output,
        `CONSTRAINT fk_pillar_context
         FOREIGN KEY(context_id)
         REFERENCES context(id)
         ON UPDATE CASCADE ON DELETE CASCADE`
      );
    });

     it('should generate a string with SQL code for UPDATE ON CASCADE', () => {
    assert();
  });

  it('should generate a string with SQL code for DELETE ON CASCADE', () => {
    assert();
  });
  });

  describe('_generateTable', () => {
    const output = synthesis._generateTable(contextAnalyzed[0]._table);

    it('should return a string', () => {
      assert.strictEqual(typeof output, 'string');
    });

    it('should generate a string with SQL code for table name without IF NOT EXISTS', () => {
      assert.strictEqual(output, 'CREATE TABLE context');
    });

    const pillarOutput = synthesis._generateTable(pillarAnalyzed[0]._table);

    it('should return a string', () => {
      assert.strictEqual(typeof pillarOutput, 'string');
    });

    it('should generate a string with SQL code for table name with IF NOT EXISTS', () => {
      assert.strictEqual(pillarOutput, 'CREATE TABLE IF NOT EXISTS pillar');
    });
  });

  describe('_operationDispatcher', () => {
    it('should be an object', () => {
      assert.strictEqual(typeof synthesis._operationDispatcher, 'object');
    });

    it('should have keys: _table, _column, _primary, _index, _foreign', () => {
      assert.ok(synthesis._operationDispatcher._table);
      assert.ok(synthesis._operationDispatcher._column);
      assert.ok(synthesis._operationDispatcher._primary);
      assert.ok(synthesis._operationDispatcher._index);
      assert.ok(synthesis._operationDispatcher._foreign);
    });
  });
*/
  describe('_generatePropCode', () => {
    const result = [{
      _table: 'CREATE TABLE context',
      _column: 'id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL, digest VARCHAR(10) NOT NULL DEFAULT \'\'\'S\'\'\'',
      _primary: 'PRIMARY KEY (id)',
      _index: 'UNIQUE INDEX idx_uq_name(name), UNIQUE INDEX idx_uq_abv(digest)',
    }];

    it('should accept objects as an input too', () => {
      const output = generatePropCode(contextAnalyzed[0]);
      assert.deepStrictEqual(JSON.stringify(output), JSON.stringify(result));
    });

    it('should return an array', () => {
      const output = generatePropCode(contextAnalyzed);
      assert.ok(Array.isArray(output));
    });
  });

  describe('_generateTableCode', () => {
    const result = ['CREATE TABLE context(id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL, digest VARCHAR(10) NOT NULL DEFAULT \'\'\'S\'\'\', PRIMARY KEY (id), UNIQUE INDEX idx_uq_name(name), UNIQUE INDEX idx_uq_abv(digest))'];

    it('should accept objects as an input too', () => {
      let output = generatePropCode(contextAnalyzed[0]);
      output = generateTableCode(output[0]);
      assert.deepStrictEqual(JSON.stringify(output), JSON.stringify(result));
    });

    it('should return a string (SQL Code)', () => {
      let output = generatePropCode(contextAnalyzed);
      output = generateTableCode(output);
      assert.strictEqual(typeof output, 'object');
    });
  });
});
