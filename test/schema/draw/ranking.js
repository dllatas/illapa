const ranking = {
  _table: {
    _name: 'ranking',
    _force: true
  },
  _column: [
    {
      _name: 'country_id',
      _type: 'INT',
      _length: 11,
      _null: false
    },
    {
      _name: 'indicator_id',
      _type: 'INT',
      _length: 11,
      _null: false
    },
    {
      _name: 'year',
      _type: 'INT',
      _length: 4,
      _null: false
    },
    {
      _name: 'position',
      _type: 'INT',
      _length: 5,
      _null: false
    },
    {
      _name: 'value',
      _type: 'DOUBLE',
      _length: '12,4',
      _null: true
    }
  ],
  _primary: [
    'country_id',
    'indicator_id',
    'year'
  ],
  _index: [
    {
      _name: 'idx_ranking_country',
      _type: 'normal',
      _column: ['country_id']
    },
    {
      _name: 'idx_ranking_indicator',
      _type: 'normal',
      _column: ['indicator_id']
    }
  ],
  _foreign: [
    {
      _name: 'fk_ranking_country',
      _table: 'country',
      _column: { 'id': 'country_id' },
      _update: 'no_action',
      _delete: 'no_action'
    },
    {
      _name: 'fk_ranking_indicator',
      _table: 'indicator',
      _column: { 'id': 'indicator_id' },
      _update: 'no_action',
      _delete: 'no_action'
    }
  ],
  _migration: {
    _oldName: 'RANKING',
    _match: {
      country_id: 'country_id',
      indicator_id: 'indicator_id',
      year: 'year',
      position: 'position',
      value: 'value'
    }
  }
}

module.exports = ranking
