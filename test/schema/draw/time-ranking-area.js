const timeRankingArea = {
  _table: {
    _name: 'timeRankingArea',
    _postGenerate: true
  },
  _column: [
    {
      _name: 'year',
      _type: 'INT',
      _length: 4,
      _null: false
    },
    {
      _name: 'countryId',
      _type: 'INT',
      _length: 11,
      _null: false
    },
    {
      _name: 'countryName',
      _type: 'VARCHAR',
      _length: 100,
      _null: false
    },
    {
      _name: 'regionId',
      _type: 'INT',
      _length: 11,
      _null: false
    },
    {
      _name: 'regionName',
      _type: 'VARCHAR',
      _length: 100,
      _null: false
    }
  ],
  _primary: [
    'year',
    'countryId',
    'regionId'
  ]
}

module.exports = timeRankingArea
