const rankingArea = {
  _table: {
    _name: 'ranking_area',
    _force: true
  },
  _column: [
    {
      _name: 'area_region_id',
      _type: 'INT',
      _length: 11,
      _null: false
    },
    {
      _name: 'area_country_id',
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
    }
  ],
  _primary: [
    'area_region_id',
    'area_country_id',
    'indicator_id',
    'year'
  ],
  _index: [
    {
      _name: 'idx_ranking_area_area',
      _type: 'normal',
      _column: ['area_region_id', 'area_country_id']
    },
    {
      _name: 'idx_ranking_area_indicator',
      _type: 'normal',
      _column: ['indicator_id']
    }
  ],
  _foreign: [
    {
      _name: 'fk_ranking_area_area',
      _table: 'area',
      _column: { 'region_id': 'area_region_id', 'country_id': 'area_country_id' },
      _update: 'no_action',
      _delete: 'no_action'
    },
    {
      _name: 'fk_ranking_area_indicator',
      _table: 'indicator',
      _column: { 'id': 'indicator_id' },
      _update: 'no_action',
      _delete: 'no_action'
    }
  ],
  _migration: {
    _oldName: 'RANKING_AREA',
    _match: {
      area_region_id: 'area_region_id',
      area_country_id: 'area_country_id',
      indicator_id: 'indicator_id',
      year: 'year',
      position: 'position'
    }
  }
}

module.exports = rankingArea
