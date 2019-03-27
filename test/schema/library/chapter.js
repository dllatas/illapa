const chapter = {
  _table: {
    _name: 'chapter',
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
      _name: 'book_id',
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
    },
  ],
  _primary: [
    'id',
  ],
  _foreign: [
    {
      _name: 'fk_chapter_book',
      _table: 'book',
      _column: { id: 'book_id' },
      _update: 'cascade',
      _delete: 'cascade',
    },
  ],
};

module.exports = chapter;
