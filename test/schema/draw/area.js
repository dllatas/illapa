const area = {
  _table: {
    _name: 'area',
    _force: true
  },
  _column: [
    {
      _name: 'region_id',
      _type: 'INT',
      _length: 11,
      _null: false
    },
    {
      _name: 'country_id',
      _type: 'INT',
      _length: 11,
      _null: false
    }
  ],
  _primary: [
    'region_id',
    'country_id'
  ],
  _foreign: [
    {
      _name: 'fk_area_region',
      _table: 'region',
      _column: { 'id': 'region_id' },
      _update: 'cascade',
      _delete: 'cascade'
    },
    {
      _name: 'fk_area_country',
      _table: 'country',
      _column: { 'id': 'country_id' },
      _update: 'cascade',
      _delete: 'cascade'
    }
  ],
  _migration: {
    _oldName: 'REGION_COUNTRY',
    _match: {
      region_id: 'region_id',
      country_id: 'country_id'
    }
  }
}

module.exports = area
