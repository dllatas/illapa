const course = {
  _table: {
    _name: 'course',
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
      _name: 'name',
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
      _name: 'idx_illegal_author_fname',
      _type: 'illegal',
      _column: ['name'],
    },
    {
      _name: 15.6,
      _type: 'normal',
      _column: ['name'],
    },
  ],
};

module.exports = course;
