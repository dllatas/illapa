const context = {
  _table: {
    _name: 'context',
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
      _name: 'instance',
      _type: 'DOUBLE',
      _length: '15.6',
      _null: false,
    },
  ],
  _primary: [
    'id',
  ],
};

module.exports = context;
