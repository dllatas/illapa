const pillar = {
  _table: {
    _name: 'pillar',
    _force: false
  },
  _column: [
    {
      _name: 'id',
      _type: 'INT',
      _length: 11,
      _null: false
    },
    {
      _name: 'context_id',
      _type: 'INT',
      _length: 11,
      _null: false
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
    'id',
    'context_id'
  ],
  _index: [
    {
      _type: 'unique',
      _name: 'idx_uq_pillar_name',
      _column: ['name']
    },
    {
      _type: 'unique',
      _name: 'idx_uq_pillar_abv',
      _column: ['digest']
    },
    {
      _type: 'normal',
      _name: 'idx_pillar_context_id',
      _column: ['context_id']
    }
  ],
  _foreign: [
    {
      _name: 'fk_pillar_context',
      _table: 'context',
      _column: { 'id': 'context_id' },
      _update: 'cascade',
      _delete: 'cascade'
    }
  ],
  _migration: {
    _oldName: 'PILLAR',
    _match: {
      id: 'id',
      context_id: 'environment_id',
      name: 'name',
      digest: 'abbreviation'
    }
  }
}

module.exports = pillar
