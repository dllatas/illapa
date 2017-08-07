const builder = require('./index').test;
//var connection = require('./connection');



test('Check if props are mandatory', () => {
  
  var input = {
    _default: '10',
    _type: 'INT',
    _length: 5
  };

  var output = {
    _default: '\'' + '10' + '\'',
    _type: 'INT',
    _length: 5
  };

  expect(builder.analysis._modifyDefaultProp(input)).toEqual(output);

});
