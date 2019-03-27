const book = require('./book');
const chapter = require('./chapter');
const paragraph = require('./paragraph');
const bookAuthor = require('./book-author');
const author = require('./author');

const schema = [
  book,
  chapter,
  paragraph,
  bookAuthor,
  author,
];

module.exports = schema;
