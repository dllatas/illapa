const timeRanking = {
  _table: {
    _name: 'timeRanking',
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
    }
  ],
  _primary: [
    'year',
    'countryId'
  ],
  _post: {
    _column: (prefix, i) => (
      {
        _name: `${prefix}${i}`,
        _indicator: i,
        _type: 'INT',
        _length: 5,
        _null: false
      }
    ),
    _load: (prefix, i) => `sum(case when x.indicatorId=${i} then x.position else 0 end) as ${prefix}${i}`,
    _insert: (load) =>
      `insert into timeRanking
      select x.year, x.countryId, x.countryName, ${load}
      from (
        select c.id countryId, c.name countryName, b.id indicatorId, 
        b.name indicatorName, b.digest indicatorAbv, a.year, a.position
        from ranking a, indicator b, country c 
        where a.indicator_id = b.id 
        and a.country_id     = c.id
        order by a.country_id, b.id, a.year) x
      group by x.countryId, x.countryName, x.year
      order by x.countryId, x.countryName, x.year;`
  }
}

module.exports = timeRanking
