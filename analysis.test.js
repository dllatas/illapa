/*
global describe
global test
global expect
*/

const context = require('../schema/context');
const Run = require('./analysis');
const Analysis = require('./analysis').analysis;
const CheckColumn = require('./analysis')._checkColumn;
const CheckIndex = require('./analysis')._checkIndex;

describe('_indexType', () => {

  test('should be an array', () => {
    expect(Analysis._indexType).toBeInstanceOf(Array);
  });

  test('should contain array with values: unique', () => {
    expect(Analysis._indexType).toEqual(expect.arrayContaining(['unique']));
  });

});

describe('_checkPropName', () => {

  test('should throw an error when name is falsy', () => {
    expect(() => { Analysis._checkPropName(); }).toThrow();
  });

  test('should throw an error when name is not string ', () => {
    expect(() => { Analysis._checkPropName(5); }).toThrow();
  });
  
});

describe('_checkPropType', () => {

  test('should throw an error when type is falsy', () => {
    expect(() => { Analysis._checkPropType(); }).toThrow();
  });

  test('should throw an error when type is not string ', () => {
    expect(() => { Analysis._checkPropType(5); }).toThrow();
  });

});

describe('_checkPropLength', () => {

  test('should throw an error when length is falsy', () => {
    expect(() => { Analysis._checkPropLength(); }).toThrow();
  });

  test('should throw an error when length is not number ', () => {
    expect(() => { Analysis._checkPropLength('5'); }).toThrow();
  });

});

describe('_setPropDefault', () => {
  
  test('should set default for string', () => {
    expect(Analysis._setPropDefault('S')).toEqual("'\S\'");
  });

  test('should set default for a string representation of a number ', () => {
    expect(Analysis._setPropDefault('6')).toEqual("'6'");
  });
  
});

describe('_checkColumn', () => {
  
  const output = CheckColumn(context._column);
  
  test('should return an array', () => {
    expect(output).toBeInstanceOf(Array);
  });

  test('should modify value of default', () => {
    expect(output[2]._default).toEqual("'\S\'");
  });

  test('should return an array with 3 lenghts', () => {
    expect(output).toHaveLength(3);
  });

});

describe('_checkPrimary', () => {
  
  test('should throw an error when value is not an array', () => {
    expect(() => { Analysis._checkPrimary('id', context); }).toThrow();
  });

  test('should throw an error when value is array but column not defined on table', () => {
    expect(() => { Analysis._checkPrimary(['id2'], context); }).toThrow();
  });

  test('should return an array', () => {
    expect(Analysis._checkPrimary(['id'], context)).toBeInstanceOf(Array);
  });

});

describe('_checkIndex', () => {
  
  const input = [
    { 
      _name: 5,
      _type: 'unique',
      _column: ['nameNotDefined'] 
    },
    { 
      _type: 'unsupportedIndex',
      _name: 'idx_uq_abv',
      _column: ['digest']
    }
  ];

  test('should throw an error when value is not an array', () => {
    expect(() => { CheckIndex('_index', context); }).toThrow();
  });

  test('should throw an error when name is not a string', () => {
    expect(() => { CheckIndex(input, context); }).toThrow();
  });

  test('should throw an error when index type is not supported', () => {
    expect(() => { CheckIndex(input, context); }).toThrow();
  });

  test('should throw an error when index column is not defined', () => {
    expect(() => { CheckIndex(input, context); }).toThrow();
  });

  test('should return an array', () => {
    expect(CheckIndex(context._index, context)).toBeInstanceOf(Array);
  });
});

describe('_checkName', () => {
  test('', () => {});
});

describe('_checkForeign', () => {
  test('', () => {});
});

describe('_checkPropDispatcher', () => {
  
  test('should be an object', () => {
    expect(Analysis._checkPropDispatcher).toBeInstanceOf(Object);
  });

  test('should have keys: _name, _column, _primary, _index, _foreign', () => {
    expect(Object.keys(Analysis._checkPropDispatcher)).toEqual(expect.arrayContaining(['_name', '_column', '_primary', '_index', '_foreign']));
  });

});

describe('run', () => {

  test('should return an array', () => {
    expect(Run(context)).toBeInstanceOf(Array);
  });
  
});