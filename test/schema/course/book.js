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
      _name: 'name',
      _type: 'VARCHAR',
      _length: 100,
      _null: false,
    },
  ],
  _primary: 'id',
  _index: {
    _name: 'idx_uq_author_fname',
    _type: 'normal',
    _column: ['name'],
  },
  _foreign: [
    {
      _name: 'fk_book_chapter',
      _table: 'chapter',
      _column: { id: 'chapter_id' },
    },
  ],
};

module.exports = book;
