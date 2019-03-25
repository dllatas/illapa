const { describe, it } = require('mocha');
const { assert } = require('chai');
const {
  analysis,
  _checkColumn,
  _checkIndex,
} = require('../src/analysis');


const context = {
  _table: {
    _name: 'context',
    _force: true,
  },
  _column: [
    {
      _name: 'id',
      _type: 'INT',
      _length: 11,
      _null: false,
      _increment: true,
    },
    {
      _name: 'name',
      _type: 'VARCHAR',
      _length: 100,
      _null: false,
      _unique: true,
    },
    {
      _name: 'digest',
      _type: 'VARCHAR',
      _length: 10,
      _null: false,
      _unique: true,
      _default: 'S',
    },
  ],
  _primary: [
    'id',
  ],
  _index: [
    {
      _name: 'idx_uq_name',
      _type: 'unique',
      _column: ['name'],
    },
    {
      _type: 'unique',
      _name: 'idx_uq_abv',
      _column: ['digest'],
    },
  ],
  _migration: {
    _oldName: 'ENVIRONMENT',
    _match: {
      id: 'id',
      name: 'name',
      digest: 'abbreviation',
    },
  },
};

describe('test suite for analysis module', () => {
  describe('_indexType', () => {
    it('should be an array', () => {
      assert.strictEqual(Array.isArray(analysis._indexType), true);
    });

    it('should contain array with values: unique', () => {
      // assert(analysis._indexType).toEqual(assert.arrayContaining(['unique']));
    });
  });

  describe('_checkPropName', () => {
    it('should throw an error when name is falsy', () => {
      assert.throws(() => { analysis._checkPropName(); });
    });

    it('should throw an error when name is not string ', () => {
      assert.throws(() => { analysis._checkPropName(5); });
    });
  });

  describe('_checkPropType', () => {
    it('should throw an error when type is falsy', () => {
      assert.throws(() => { analysis._checkPropType(); });
    });

    it('should throw an error when type is not string ', () => {
      assert.throws(() => { analysis._checkPropType(5); });
    });
  });

  describe('_checkPropLength', () => {
    it('should throw an error when length is falsy', () => {
      assert.throws(() => { analysis._checkPropLength(); });
    });

    it('should throw an error when length is not a number ', () => {
      assert.throws(() => { analysis._checkPropLength('abc'); });
    });
  });

  describe('_setPropDefault', () => {
    /* it('should set default for string', () => {
      const input = analysis._setPropDefault('S');
      assert.strictEqual(input, '\'\S\'');
    }); */

    it('should set default for a string representation of a number ', () => {
      const input = analysis._setPropDefault('6');
      assert.strictEqual(input, '\'6\'');
    });
  });

  describe('_checkColumn', () => {
    const output = _checkColumn(context._column);

    it('should return an array', () => {
      assert.ok(Array.isArray(output));
    });

    it('should modify value of default', () => {
      assert.strictEqual(output[2]._default, '\'\'S\'\'');
    });

    it('should return an array with 3 lenghts', () => {
      assert.strictEqual(output.length, 3);
    });
  });

  describe('_checkPrimary', () => {
    it('should throw an error when value is not an array', () => {
      assert.throws(() => { analysis._checkPrimary('id', context); });
    });

    it('should throw an error when value is array but column not defined on table', () => {
      assert.throws(() => { analysis._checkPrimary(['id2'], context); });
    });

    it('should return an array', () => {
      assert.ok(Array.isArray(analysis._checkPrimary(['id'], context)));
    });
  });

  describe('_checkIndex', () => {
    const input = [
      {
        _name: 5,
        _type: 'unique',
        _column: ['nameNotDefined'],
      },
      {
        _type: 'unsupportedIndex',
        _name: 'idx_uq_abv',
        _column: ['digest'],
      },
    ];

    it('should throw an error when value is not an array', () => {
      assert.throws(() => { _checkIndex('_index', context); });
    });

    it('should throw an error when name is not a string', () => {
      assert.throws(() => { _checkIndex(input, context); });
    });

    it('should throw an error when index type is not supported', () => {
      assert.throws(() => { _checkIndex(input, context); });
    });

    it('should throw an error when index column is not defined', () => {
      assert.throws(() => { _checkIndex(input, context); });
    });

    it('should return an array', () => {
      assert.ok(Array.isArray(_checkIndex({}, {})));
    });
  });

  describe('_checkPropDispatcher', () => {
    it('should be an object', () => {
      assert.strictEqual(typeof analysis._checkPropDispatcher, 'object');
    });

    it('should have keys: _table, _column, _primary, _index, _foreign', () => {
      /* assert(
        Object.keys(analysis._checkPropDispatcher)
      ).toEqual(assert.arrayContaining(
        ['_table', '_column', '_primary', '_index', '_foreign']
      )); */
    });
  });

  /* describe('run', () => {
    it('should return an array', () => {
      assert.ok(Array.isArray(Run({})));
    });
  }); */
});
