const course = require('./course');
const modules = require('./modules');
const context = require('./context');
const generic = require('./generic');
const science = require('./science');
const book = require('./book');

const schema = [
  course,
  modules,
  context,
  generic,
  science,
  book,
];

module.exports = schema;
