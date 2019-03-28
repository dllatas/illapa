const { describe, it } = require('mocha');
const { assert } = require('chai');

// const main = require('../src');
const analysis = require('../src/analysis');
// const synthesis = require('../src/synthesis');
const { course } = require('./schema');

// const POSTGRES = 'pg';
// const MYSQL = 'mysql';

describe('Analysis test module', () => {
  /*
   * const expected = {
    [POSTGRES]: {},
    [MYSQL]: {},
  };
  */

  describe('Table analysis', () => {
    const table = true;
    const analyzed = analysis(course.filter(l => l._table._name === table));

    it('Analysis should flag issues for type in name and force', () => {
      assert.isArray(analyzed.errorList);
      assert.lengthOf(analyzed.errorList, 2);
    });

    it('Check that name\'s type is a string', () => {
      assert.isArray(analyzed.errorList);
      assert.lengthOf(analyzed.errorList, 2);
      assert.deepEqual(
        analyzed.errorList[0],
        {
          msg: 'The table name must be a string. Instead table true has a name of type boolean',
          table: true,
          prop: '_table',
        },
      );
    });

    it('Check that name\'s force field is a boolean', () => {
      assert.deepEqual(
        analyzed.errorList[1],
        {
          msg: 'The table force must be a boolean. Instead table true has a force of type number',
          table: true,
          prop: '_table',
        },
      );
    });

    it('Remove force field when it is falsy', () => {
      const table = 'modules';
      const expected = { _name: 'modules' };
      const analyzed = analysis(course.filter(l => l._table._name === table));
      assert.deepEqual(analyzed.schema[0]._table, expected);
    });
  });

  describe('Primary key analysis', () => {
    it('Parse input into array', () => {
      const table = 'book';
      const expected = ['id'];
      const analyzed = analysis(course.filter(l => l._table._name === table));
      assert.isArray(analyzed.schema[0]._primary);
      assert.deepEqual(analyzed.schema[0]._primary, expected);
    });
    it('Remove force field when it is falsy', () => {
      const table = 'modules';
      const analyzed = analysis(course.filter(l => l._table._name === table));
      assert.isArray(analyzed.errorList);
      assert.lengthOf(analyzed.errorList, 1);
      assert.deepEqual(
        analyzed.errorList[0],
        {
          msg: 'The primary key should be a column on the table: ghost is not one',
          table: 'modules',
          prop: '_primary',
        },
      );
    });
  });

  describe('Column analysis', () => {
    const table = 'generic';
    const analyzed = analysis(course.filter(l => l._table._name === table));

    it('Analysis should flag issues for no type, name\'s type, no number for size, mandatory name', () => {
      assert.isArray(analyzed.errorList);
      assert.lengthOf(analyzed.errorList, 5);
      console.log(analyzed);
    });

    it('Check that column does not have a type', () => {
      assert.deepEqual(
        analyzed.errorList[0],
        {
          msg: 'A type must be defined for a column',
          table: 'generic',
          prop: '_column',
        },
      );
    });

    it('Check that name\'s type is string', () => {
      assert.deepEqual(
        analyzed.errorList[1],
        {
          msg: 'A name must be of type string. Currently, undefined is type undefined',
          table: 'generic',
          prop: '_column',
        },
      );
    });

    it('Check when size is not a number', () => {
      assert.deepEqual(
        analyzed.errorList[2],
        {
          msg: 'Column size must be a valid number representation. Currently, NaN',
          table: 'generic',
          prop: '_column',
        },
      );
    });

    it('Check that column does not have a name', () => {
      assert.deepEqual(
        analyzed.errorList[3],
        {
          msg: 'A column must have a name',
          table: 'generic',
          prop: '_column',
        },
      );
    });

    it('Replace commas by dots in size', () => {
      const expected = ['11', '15,6', '100', 'treintayocho', ''];
      assert.deepEqual(analyzed.schema[0]._column.map(c => c._length), expected);
    });

    it('Ensure default works for type string', () => {
      const expected = [undefined, 0.0, `'GENERIC'`, undefined, undefined];
      assert.deepEqual(analyzed.schema[0]._column.map(c => c._default), expected);
    });
  });


  describe('Index analysis', () => {
    const table = 'course';
    const analyzed = analysis(course.filter(l => l._table._name === table));

    it('Analysis should flag issues for legality and inconsistency', () => {
      assert.isArray(analyzed.errorList);
      assert.lengthOf(analyzed.errorList, 3);
    });

    it('Check that all elements in column exist', () => {
      assert.deepEqual(
        analyzed.errorList[0],
        {
          msg: 'The index column should be a column on the table: fname is not one',
          table: 'course',
          prop: '_index',
          name: 'idx_uq_author_fname',
        },
      );
    });

    it('Check that index type is legal (unique or normal)', () => {
      assert.deepEqual(
        analyzed.errorList[1],
        {
          msg: 'The index type is not defined: illegal',
          table: 'course',
          prop: '_index',
          name: 'idx_illegal_author_fname',
        },
      );
    });

    it('Check that index name is of type string', () => {
      assert.deepEqual(
        analyzed.errorList[2],
        {
          msg: 'The index name should be a string: 15.6 (number)',
          table: 'course',
          prop: '_index',
          name: 15.6,
        },
      );
    });

    it('Parse input into array', () => {
      const table = 'book';
      const expected =[{
        _name: 'idx_uq_author_fname',
        _type: 'normal',
        _column: ['name'],
      }];
      const analyzed = analysis(course.filter(l => l._table._name === table));
      assert.isArray(analyzed.schema[0]._index);
      assert.deepEqual(analyzed.schema[0]._index, expected);
    });
  });

  describe('Foreign key analysis', () => {
    const table = 'book';
    const analyzed = analysis(course.filter(l => l._table._name === table)[0]);
  });
});
