const context = {
  _table: {
    _name: 'context',
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
    { _name: 'name',
      _type: 'VARCHAR',
      _length: 100,
      _null: false,
      _unique: true
    },
    { _name: 'digest',
      _type: 'VARCHAR',
      _length: 10,
      _null: false,
      _unique: true,
      _default: 'S'
    }
  ],
  _primary: [
    'id'
  ],
  _index: [
    {
      _name: 'idx_uq_context_name',
      _type: 'unique',
      _column: ['name']
    },
    {
      _type: 'unique',
      _name: 'idx_uq_context_abv',
      _column: ['digest']
    }
  ],
  _migration: {
    _oldName: 'ENVIRONMENT',
    _match: {
      id: 'id',
      name: 'name',
      digest: 'abbreviation'
    }
  },
  exported: {
    raw: true
  }
}

module.exports = context
