const area = require('./area')
const context = require('./context')
const country = require('./country')
const indicator = require('./indicator')
const metadata = require('./metadata')
const pillar = require('./pillar')
const rankingArea = require('./ranking-area')
const ranking = require('./ranking')
const region = require('./region')
const source = require('./source')

// TODO: Generate function that orders the tables properly for generation
const schema = [
  context,
  pillar,
  source,
  country,
  region,
  area,
  indicator,
  metadata,
  ranking,
  rankingArea
]

module.exports = schema
