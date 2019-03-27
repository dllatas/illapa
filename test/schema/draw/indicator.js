const indicator = {
  _table: {
    _name: 'indicator',
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
      _null: true,
      _unique: false
    },
    {
      _name: 'scope',
      _type: 'INT',
      _length: 11,
      _null: false,
      _default: '2'
    },
    {
      _name: 'source_id',
      _type: 'INT',
      _length: 11,
      _null: true
    },
    {
      _name: 'context_id',
      _type: 'INT',
      _length: 11,
      _null: true
    },
    {
      _name: 'pillar_id',
      _type: 'INT',
      _length: 11,
      _null: true
    }
  ],
  _primary: [
    'id'
  ],
  _index: [
    {
      _name: 'idx_uq_indicator_name',
      _type: 'unique',
      _column: ['name']
    },
    {
      _name: 'idx_source_indicator_id',
      _type: 'normal',
      _column: ['source_id']
    },
    {
      _name: 'idx_pillar_indicator_id',
      _type: 'normal',
      _column: ['context_id', 'pillar_id']
    }
  ],
  _foreign: [
    {
      _name: 'fk_indicator_pillar',
      _table: 'pillar',
      _column: { 'id': 'pillar_id', 'context_id': 'context_id' },
      _update: 'cascade',
      _delete: 'cascade'
    },
    {
      _name: 'fk_indicator_source',
      _table: 'source',
      _column: { 'id': 'source_id' },
      _update: 'cascade',
      _delete: 'cascade'
    }
  ],
  _migration: {
    _oldName: 'INDICATOR',
    _match: {
      id: 'id',
      name: 'name',
      digest: 'abbreviation',
      scope: 'scope',
      source_id: 'source_id',
      context_id: 'environment_id',
      pillar_id: 'pillar_id'
    }
  }
}

module.exports = indicator
