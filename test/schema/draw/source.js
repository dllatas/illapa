const source = {
  _table: {
    _name: 'source',
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
      _name: 'name',
      _type: 'VARCHAR',
      _length: 100,
      _null: false,
      _unique: true
    },
    {
      _name: 'digest',
      _type: 'VARCHAR',
      _length: 10,
      _null: false,
      _unique: true
    }
  ],
  _primary: [
    'id'
  ],
  _index: [
    {
      _type: 'unique',
      _name: 'idx_uq_source_name',
      _column: ['name']
    },
    {
      _type: 'unique',
      _name: 'idx_uq_source_abv',
      _column: ['digest']
    }
  ],
  _migration: {
    _oldName: 'SOURCE',
    _match: {
      id: 'id',
      name: 'name',
      digest: 'abbreviation'
    }
  }
}

module.exports = source
