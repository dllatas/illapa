const paragraph = {
  _table: {
    _name: 'paragraph',
    _force: false,
  },
  _column: [
    {
      _name: 'id',
      _type: 'INT',
      _length: 11,
      _null: false,
      _increment: true,
    },
    {
      _name: 'chapter_id',
      _type: 'INT',
      _length: 11,
      _null: false,
      _increment: true,
    },
    {
      _name: 'text',
      _type: 'VARCHAR',
      _length: 1000,
      _null: false,
      _unique: true,
    },
  ],
  _primary: [
    'id',
  ],
  _index: [
    {
      _type: 'unique',
      _name: 'idx_uq_paragraph_text',
      _column: ['text'],
    },
    {
      _type: 'normal',
      _name: 'idx_paragraph_chapter_id',
      _column: ['chapter_id'],
    },
  ],
  _foreign: [
    {
      _name: 'fk_paragraph_chapter',
      _table: 'chapter',
      _column: { id: 'chapter_id' },
    },
  ],
};

module.exports = paragraph;
