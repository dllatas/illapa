const region = {
  _table: {
    _name: 'region',
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
      _name: 'region_id',
      _type: 'INT',
      _length: 11,
      _null: true
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
      _null: false
    },
    {
      _name: 'active',
      _type: 'VARCHAR',
      _length: 1,
      _null: false,
      _default: 'Y'
    },
    {
      _name: 'benchmark',
      _type: 'VARCHAR',
      _length: 1,
      _null: true,
      _default: 'NULL'
    },
    {
      _name: 'unCode',
      _type: 'VARCHAR',
      _length: 3,
      _null: true,
      _default: 'NULL'
    }
  ],
  _primary: [
    'id'
  ],
  _index: [
    {
      _name: 'idx_uq_region_name',
      _type: 'unique',
      _column: ['name']
    },
    {
      _name: 'idx_uq_region_dig',
      _type: 'unique',
      _column: ['digest']
    },
    {
      _name: 'idx_region_id',
      _type: 'normal',
      _column: ['region_id']
    }
  ],
  _foreign: [
    {
      _name: 'fk_region_region',
      _table: 'region',
      _column: { 'id': 'region_id' },
      _update: 'cascade',
      _delete: 'cascade',
    },
  ],
  _migration: {
    _oldName: 'REGION',
    _match: {
      id: 'id',
      region_id: 'region_id',
      name: 'name',
      digest: 'abbreviation',
      active: 'enabled',
      benchmark: 'high',
      unCode: 'code'
    }
  }
}

module.exports = region
