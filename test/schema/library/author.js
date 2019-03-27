const author = {
  _table: {
    _name: 'author',
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
      _name: 'author_id',
      _type: 'INT',
      _length: 11,
      _null: true,
    },
    {
      _name: 'fname',
      _type: 'VARCHAR',
      _length: 100,
      _null: false,
    },
    {
      _name: 'lname',
      _type: 'VARCHAR',
      _length: 100,
      _null: false,
    },
  ],
  _primary: [
    'id',
  ],
  _index: [
    {
      _name: 'idx_uq_author_fname',
      _type: 'unique',
      _column: ['fname'],
    },
    {
      _name: 'idx_uq_author_lname',
      _type: 'unique',
      _column: ['lname'],
    },
  ],
  _foreign: [
    {
      _name: 'fk_author_author',
      _table: 'author',
      _column: { id: 'author_id' },
      _update: 'cascade',
      _delete: 'cascade',
    },
  ],
};

module.exports = author;
