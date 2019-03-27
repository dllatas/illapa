const book = {
  _table: {
    _name: 'book',
    _force: false,
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
      _name: 'title',
      _type: 'VARCHAR',
      _length: 1000,
      _null: false,
      _unique: true,
      _default: 'BOOK TITLE',
    },
  ],
  _primary: [
    'id',
  ],
};

module.exports = book;
