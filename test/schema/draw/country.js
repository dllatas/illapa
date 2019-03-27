const country = {
  _table: {
    _name: 'country',
    _force: true
  },
  _column: [
    {
      _name: 'id',
      _type: 'INT',
      _length: 11,
      _null: false,
      _increment: true
    },
    {
      _name: 'code',
      _type: 'VARCHAR',
      _length: 2,
      _null: false
    },
    {
      _name: 'name',
      _type: 'VARCHAR',
      _length: 100,
      _null: false
    },
    {
      _name: 'digest',
      _type: 'VARCHAR',
      _length: 10,
      _null: true,
      _default: 'NULL'
    }
  ],
  _primary: [
    'id'
  ],
  _index: [
    {
      _name: 'idx_uq_country_code',
      _type: 'unique',
      _column: ['code']
    },
    {
      _name: 'idx_uq_country_name',
      _type: 'unique',
      _column: ['name']
    },
    {
      _name: 'idx_uq_country_dig',
      _type: 'unique',
      _column: ['digest']
    }
  ],
  _migration: {
    _oldName: 'COUNTRY',
    _match: {
      id: 'id',
      code: 'code',
      name: 'name',
      digest: 'abbreviation'
    }
  }
}

module.exports = country;
