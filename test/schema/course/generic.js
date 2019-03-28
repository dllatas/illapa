const generic = {
  _table: {
    _name: 'generic',
    _force: true,
  },
  _column: [
    {
      _name: 'id',
      _length: 11,
      _null: false,
      _increment: true,
    },
    {
      _name: 'instance',
      _type: 'DOUBLE',
      _length: '15.6',
      _null: false,
      _default: 0.0,
    },
    {
      _name: 'name',
      _type: 'VARCHAR',
      _length: '100',
      _null: false,
      _default: 'GENERIC',
    },
    {
      _name: 'loco',
      _type: 'VARCHAR',
      _length: 'treintayocho',
      _null: false,
    },
    {
      _type: 'VARCHAR',
      _null: false,
      _length: '',
    },
  ],
  _primary: [
    'id',
  ],
};

module.exports = generic;
