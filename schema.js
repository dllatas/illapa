var schema = {
	// Total tables: 17 including time_ranking and time_area_ranking
	// _keys and _index, use arrays for creating one of them with all the fields in the array
	// _keys._primary es un array que va a generar la PK
	context: {
		_column: [
			{ _name: 'id',  		 _type: 'INT',     _length: 11,  _null: false, _increment: true },
			{ _name: 'name', 		 _type: 'VARCHAR', _length: 100, _null: false, _unique: true },
			{ _name: 'abbreviation', _type: 'VARCHAR', _length: 10,  _null: false, _unique: true /*, _default: 'S'*/ },
		],
		_primary: ['id'],
		_index: [
			{ _type: '_unique', _name: 'idx_uq_name', _fields: ['name'] },
			{ _type: '_unique', _name: 'idx_uq_abv',  _fields: ['abbreviation'] }
		]
	},
	source: {
		_column: [
			{ _name: 'id',			 _type: 'INT',     _length: 11,  _null: false, _increment: true },
		    { _name: 'name',		 _type: 'VARCHAR', _length: 100, _null: false, _unique: true },
			{ _name: 'abbreviation', _type: 'VARCHAR', _length: 10,  _null: false, _unique: true }
		],
		_primary:     ['id'],
		_index:       [
			{ _type: '_unique', _name: 'idx_uq_name', _fields: ['name'] },
			{ _type: '_unique', _name: 'idx_uq_abv',  _fields: ['abbreviation'] }
		]
	},
	pillar: {
		_column: [
			{ _name: 'id', 			 _type: 'INT',     _length: 11,  _null: false },
			{ _name: 'context_id', 	 _type: 'INT',     _length: 11,  _null: false },
			{ _name: 'name', 		 _type: 'VARCHAR', _length: 100, _null: false, _unique: true },
			{ _name: 'abbreviation', _type: 'VARCHAR', _length: 10,  _null: false, _unique: true },
		],
		_primary: ['id', 'context_id'],
        _index: [
            { _type: '_unique', _name: 'idx_uq_name', _fields: ['name'] },
            { _type: '_unique', _name: 'idx_uq_abv',  _fields: ['abbreviation'] },
            { _type: '_normal', _name: 'idx_context_id',  _fields: ['context_id'] }
        ],
		_foreign: [
            { _name: 'fk_pillar_context', _table: 'context', _fields: { 'id' : 'context_id' }, _update: 'cascade', _delete: 'cascade' }
        ] 
        
        /*{
			: {
				// foreign_table: { foreign_field: host_field }
				context: { 'id' : 'context_id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			}
		}*/
	},

    /*
	indicator: {
		id:           { _type: 'INT',     _length: 11,  _null: false, _increment: true },
		name:         { _type: 'VARCHAR', _length: 100, _null: false, _unique: true },
		abbreviation: { _type: 'VARCHAR', _length: 10,  _null: true,  _unique: false },
		scope:        { _type: 'INT',     _length: 11,  _null: false, _default: '2' },
		source_id:    { _type: 'INT',     _length: 11,  _null: true },
		context_id:   { _type: 'INT',     _length: 11,  _null: true },
		pillar_id:    { _type: 'INT',     _length: 11,  _null: true },
		_primary:     ['id'],
		_index:       {
			_unique: {
				idx_uq_name: ['name'],
			},
			_normal: {
				idx_source_id: ['source_id'],
				idx_pillar_id: ['context_id', 'pillar_id'],
			}
		},
		_foreign: {
			fk_indicator_pillar: {
				pillar: { 'pillar_id': 'id', 'context_id': 'context_id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			},
			fk_indicator_source: {
				source: { 'source_id': 'id'},
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			}
		}
	},
	// metadata ... better name ??? indicator_metadata ??? too long :p
	metadata: {
		id: { _type: 'INT', _length: 11, _null: false },
		description: { _type: 'VARCHAR', _length: 500, _null: true, _default: true },
		source: { _type: 'VARCHAR', _length: 500, _null: true, _default: true },
		further: { _type: 'VARCHAR', _length: 200, _null: true, _default: true },
		_primary: ['id']
	},
	// REGION
	region: {
		id:           { _type: 'INT',     _length: 11,  _null: false, _increment: true },
		region_id:    { _type: 'INT',     _length: 11,  _null: true },
		name:         { _type: 'VARCHAR', _length: 100, _null: false },
		abbreviation: { _type: 'VARCHAR', _length: 10, _null: false },
		// old name: enabled -> new name: active
		// change datatype to tinyint (boolean)
		active: { _type: 'VARCHAR', _length: 1, _null: false, _default: 'Y' },
		// old name: high -> new name: benchmark
		// change datatype to tinyint (boolean)
		benchmark: { _type: 'VARCHAR', _length: 1, _null: true, _default: 'NULL' },
		// old name: code -> new name: unCode
		unCode: { _type: 'VARCHAR', _length: 3, _null: true, _default: 'NULL' },
		_primary: ['id'],
		_index:       {
			_unique: {
				idx_uq_name: ['name'],
				idx_uq_abv: ['abbreviation'],
			},
			_normal: {
				idx_region_id: ['region_id'],
			}
		},
		_foreign: {
            fk_region_region: {
                region: { 'region_id': 'id' },
                _update: { 'cascade': true },
                _delete: { 'cascade': true }
            }
        }
	},
	// COUNTRY
	country: {
		id:           { _type: 'INT',     _length: 11,  _null: false, _increment: true },
		code:         { _type: 'VARCHAR', _length: 2,   _null: false },
		name:         { _type: 'VARCHAR', _length: 100, _null: false },
		abbreviation: { _type: 'VARCHAR', _length: 10,  _null: true, _default: 'NULL' },
		_primary: ['id'],
		_index:       {
			_unique: {
				idx_uq_code: ['code'],
				idx_uq_name: ['name'],
				idx_uq_abv:  ['abbreviation'],
			}
		}
	},
	// AREA
	// Change table name from REGION_COUNTRY to area
	area: {
		region_id:  { _type: 'INT', _length: 11, _null: false },
		country_id: { _type: 'INT', _length: 11, _null: false },
		_primary: ['region_id', 'country_id'],
		_foreign: {
			fk_area_region: {
				region: { 'region_id': 'id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			},
			fk_area_country: {
				country: { 'country_id': 'id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			}
		}
	},
	// ranking at country level
	ranking: {
		country_id:   { _type: 'INT',    _length: 11,     _null: false },
		indicator_id: { _type: 'INT',    _length: 11,     _null: false },
		year:         { _type: 'INT',    _length: 4,      _null: false },
		position:     { _type: 'INT',    _length: 5,      _null: false },
		value:        { _type: 'DOUBLE', _length: '12,4', _null: true },
		_primary:     ['country_id', 'indicator_id', 'year'],
		_index:       {
			_normal: {
				idx_ranking_country: ['country_id'],
				idx_ranking_indicator: ['indicator_id'],
			}
		},
		_foreign: {
			fk_ranking_country: {
				country: { 'country_id': 'id' },
				_update: { 'no_action': true },
				_delete: { 'no_action': true }
			},
			fk_ranking_indicator: {
				indicator: { 'indicator_id': 'id' },
				_update: { 'no_action': true },
				_delete: { 'no_action': true }
			}
		}
	},
	// ranking at area level: indicator + area
	// remove country_id since ranking_area is not child of ranking
	ranking_area: {
		area_region_id:  { _type: 'INT', _length: 11, _null: false },
		area_country_id: { _type: 'INT', _length: 11, _null: false },
		indicator_id:    { _type: 'INT', _length: 11, _null: false },
		year:            { _type: 'INT', _length:  4, _null: false },
		position:        { _type: 'INT', _length:  5, _null: false },
		_primary: ['area_region_id', 'area_country_id', 'indicator_id', 'year'],
		_index:       {
			_normal: {
				idx_ranking_area_area: ['area_region_id', 'area_country_id'],
				idx_ranking_area_indicator: ['indicator_id'],
			}
		},
		_foreign: {
			fk_ranking_area_area: {
				area: { 'area_region_id': 'region_id', 'area_country_id': 'country_id' },
				_update: { 'no_action': true },
				_delete: { 'no_action': true }
			},
			fk_ranking_area_indicator: {
				indicator: { 'indicator_id': 'id' },
				_update: { 'no_action': true },
				_delete: { 'no_action': true }
			}
		}
	},
	// 7 tables left ... upper tables: app tables (except for time_ranking and time_area_ranking) ... that has to be generated on the fly

	// 5 tables left: user tables
	// user
	user: {
		username: { _type: 'VARCHAR', _length: 100, _null: false },
		password: { _type: 'VARCHAR', _length: 50, _null: false },
		email: { _type: 'VARCHAR', _length: 50, _null: false },
		name: { _type: 'VARCHAR', _length: 50, _null: false },
		last_name: { _type: 'VARCHAR', _length: 50, _null: false },
		level: { _type: 'INT', _length: 1, _null: false, _default: 2 },
		tooltip: { _type: 'VARCHAR', _length: 1, _null: false, _default: 'S' },
		scope: { _type: 'INT', _length: 1, _null: false, _default: 2 },
		_primary: [ 'username' ],
		_index: {
			_unique: {
				idx_uq_email: ['email'],
			}
		}
	},
	// label -> user_indicator
	user_indicator: {
		username: { _type:  'VARCHAR', _length: 100, _null: false },
		id: { _type: 'INT', _length: 11, _null: false },
		name: { _type:  'VARCHAR', _length: 50, _null: false },
		_primary: [ 'username', 'id'],
		_foreign: {
			fk_user_indicator_user: {
				user: { 'username': 'username' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			}
		}
	},
	// label_detail -> user_indicator_detail
	user_indicator_detail: {
		username:     { _type:  'VARCHAR', _length: 100, _null: false },
		label_id:     { _type: 'INT', _length: 11, _null: false},
		indicator_id: { _type: 'INT', _length: 11, _null: false },
		_primary: ['username', 'label_id', 'indicator_id'],
		_index:       {
			_normal: {
				idx_user_indicator_detail_indicator: ['indicator_id']
			}
		},
		_foreign: {
			fk_user_indicator_detail_parent: {
				user_indicator: { 'username': 'username', 'label_id': 'id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			},
			fk_user_indicator_detail_indicator: {
				indicator: { 'indicator_id': 'id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			},
		}
	},
	// zone -> user_area
	user_area: {
		username:     { _type:  'VARCHAR', _length: 100, _null: false },
		id: { _type: 'INT', _length: 11, _null: false },
		name:     { _type:  'VARCHAR', _length: 50, _null: false },
		region_id: { _type:  'INT', _length: 11, _null: true, _default: 'NULL' },
		_primary: [ 'username', 'id'],
		_index:       {
			_normal: {
				idx_user_area_region: ['region_id'],
				idx_user_area_user: ['username']
			}
		},
		_foreign: {
			fk_user_area_region: {
				region: { 'region_id': 'id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			},
			fk_user_area_user: {
				user: { 'username': 'username' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			},
		}
	},
	// zone_detail  -> user_area_detail
	user_area_detail: {
		username:     { _type:  'VARCHAR', _length: 100, _null: false },
		user_area_id: { _type:  'INT',     _length: 11,  _null: false },
		country_id:   { _type:  'INT',     _length: 11,  _null: false },
		_primary: [ 'username', 'user_area_id', 'country_id'],
		_index:       {
			_normal: {
				user_area_detail_parent: [ 'username', 'user_area_id' ],
				user_area_detail_country: [ 'country_id' ]
			}
		},
		_foreign: {
			fk_user_area_detail_parent: {
				user_area: { 'username': 'username', 'user_area_id': 'id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			},
			fk_user_area_detail_country: {
				country: { 'country_id': 'id' },
				_update: { 'cascade': true },
				_delete: { 'cascade': true }
			},
		}
    }
    */
};

module.exports = schema;