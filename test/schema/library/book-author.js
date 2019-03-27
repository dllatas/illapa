const bookAuthor = {
  _table: {
    _name: 'book_author',
    _force: false,
  },
  _column: [
    {
      _name: 'book_id',
      _type: 'INT',
      _length: 11,
      _null: false,
      _increment: true,
    },
    {
      _name: 'author_id',
      _type: 'INT',
      _length: 11,
      _null: false,
      _increment: true,
    },
  ],
  _primary: [
    'book_id',
    'author_id',
  ],
  _foreign: [
    {
      _name: 'fk_book_author_book',
      _table: 'book',
      _column: { id: 'book_id' },
      _update: 'cascade',
      _delete: 'cascade',
    },
    {
      _name: 'fk_book_author_author',
      _table: 'author',
      _column: { id: 'author_id' },
      _update: 'cascade',
      _delete: 'cascade',
    },
  ],
};

module.exports = bookAuthor;
