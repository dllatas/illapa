const metadata = {
  _table: {
    _name: 'metadata',
    _force: true
  },
  _column: [
    {
      _name: 'id',
      _type: 'INT',
      _length: 11,
      _null: false
    },
    {
      _name: 'description',
      _type: 'VARCHAR',
      _length: 500,
      _null: true
    },
    {
      _name: 'source',
      _type: 'VARCHAR',
      _length: 500,
      _null: true
    },
    {
      _name: 'further',
      _type: 'VARCHAR',
      _length: 200,
      _null: true
    }
  ],
  _primary: [
    'id'
  ],
  _migration: {
    _oldName: 'metadata',
    _match: {
      id: 'id',
      description: 'description',
      source: 'source',
      further: 'further'
    }
  }
}

module.exports = metadata
