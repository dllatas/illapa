const modules = {
  _table: {
    _name: 'modules',
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
  _primary: [
    'id',
    'ghost',
  ],
  _index: [
    {
      _name: 'idx_uq_author_fname',
      _type: 'normal',
      _column: ['name'],
    },
  ],
};

module.exports = modules;
