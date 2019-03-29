const { describe, it } = require('mocha');
const { assert } = require('chai');

const main = require('../src');
const { library, course } = require('./schema');

const POSTGRES = 'pg';
const MYSQL = 'mysql';


describe('Main test module', () => {
  const expected = {
    [POSTGRES]: {
      book: 'CREATE TABLE IF NOT EXISTS book (id SERIAL NOT NULL, title VARCHAR(1000) NOT NULL DEFAULT \'BOOK TITLE\', PRIMARY KEY (id));',
      chapter: 'CREATE TABLE IF NOT EXISTS chapter (id SERIAL NOT NULL, book_id SERIAL NOT NULL, title VARCHAR(1000) NOT NULL, PRIMARY KEY (id), CONSTRAINT fk_chapter_book FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE ON UPDATE CASCADE);',
      paragraph: {
        table: 'CREATE TABLE IF NOT EXISTS paragraph (id SERIAL NOT NULL, chapter_id SERIAL NOT NULL, text VARCHAR(1000) NOT NULL, PRIMARY KEY (id), CONSTRAINT idx_uq_paragraph_text UNIQUE (text), CONSTRAINT fk_paragraph_chapter FOREIGN KEY (chapter_id) REFERENCES chapter (id));',
        index: 'CREATE INDEX idx_paragraph_chapter_id ON paragraph (chapter_id);',
      },
      book_author: 'CREATE TABLE IF NOT EXISTS book_author (book_id SERIAL NOT NULL, author_id SERIAL NOT NULL, PRIMARY KEY (book_id, author_id), CONSTRAINT fk_book_author_book FOREIGN KEY (book_id) REFERENCES book (id) ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT fk_book_author_author FOREIGN KEY (author_id) REFERENCES author (id) ON DELETE CASCADE ON UPDATE CASCADE);',
      author: {
        table: 'CREATE TABLE author (id SERIAL NOT NULL, author_id INT NULL, fname VARCHAR(100) NOT NULL, lname VARCHAR(100) NOT NULL, PRIMARY KEY (id), CONSTRAINT idx_uq_author_fname UNIQUE (fname), CONSTRAINT idx_uq_author_lname UNIQUE (lname));',
        fk: 'ALTER TABLE author ADD CONSTRAINT fk_author_author FOREIGN KEY (author_id) REFERENCES author (id) ON DELETE CASCADE ON UPDATE CASCADE;',
      },
    },
    [MYSQL]: {
      book: 'CREATE TABLE IF NOT EXISTS book (id INT(11) NOT NULL AUTO_INCREMENT, title VARCHAR(1000) NOT NULL DEFAULT \'BOOK TITLE\', PRIMARY KEY (id));',
      chapter: 'CREATE TABLE IF NOT EXISTS chapter (id INT(11) NOT NULL AUTO_INCREMENT, book_id INT(11) NOT NULL AUTO_INCREMENT, title VARCHAR(1000) NOT NULL, PRIMARY KEY (id), CONSTRAINT fk_chapter_book FOREIGN KEY (book_id) REFERENCES book (id) ON UPDATE CASCADE ON DELETE CASCADE);',
      paragraph: 'CREATE TABLE IF NOT EXISTS paragraph (id INT(11) NOT NULL AUTO_INCREMENT, chapter_id INT(11) NOT NULL AUTO_INCREMENT, text VARCHAR(1000) NOT NULL, PRIMARY KEY (id), UNIQUE INDEX idx_uq_paragraph_text(text), INDEX idx_paragraph_chapter_id(chapter_id), CONSTRAINT fk_paragraph_chapter FOREIGN KEY (chapter_id) REFERENCES chapter (id));',
      book_author: 'CREATE TABLE IF NOT EXISTS book_author (book_id INT(11) NOT NULL AUTO_INCREMENT, author_id INT(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (book_id, author_id), CONSTRAINT fk_book_author_book FOREIGN KEY (book_id) REFERENCES book (id) ON UPDATE CASCADE ON DELETE CASCADE, CONSTRAINT fk_book_author_author FOREIGN KEY (author_id) REFERENCES author (id) ON UPDATE CASCADE ON DELETE CASCADE);',
      author: {
        table: 'CREATE TABLE author (id INT(11) NOT NULL AUTO_INCREMENT, author_id INT(11) NULL, fname VARCHAR(100) NOT NULL, lname VARCHAR(100) NOT NULL, PRIMARY KEY (id), UNIQUE INDEX idx_uq_author_fname(fname), UNIQUE INDEX idx_uq_author_lname(lname));',
        fk: 'ALTER TABLE author ADD CONSTRAINT fk_author_author FOREIGN KEY (author_id) REFERENCES author (id) ON DELETE CASCADE ON UPDATE CASCADE;',
      }
    },
  };

  describe('Generate code for library', () => {
    it('Should generate code for the whole schema in Postgres', () => {
      const actual = main(library, POSTGRES, '_foreign._table', '_table._name');
      assert.isFalse(actual.error);
      assert.isArray(actual.code);
      assert.lengthOf(actual.code, 7);
      assert.strictEqual(actual.code[0], expected[POSTGRES].book);
      assert.strictEqual(actual.code[1], expected[POSTGRES].chapter);
      assert.strictEqual(actual.code[2], expected[POSTGRES].paragraph.table);
      assert.strictEqual(actual.code[3], expected[POSTGRES].author.table);
      assert.strictEqual(actual.code[4], expected[POSTGRES].book_author);
      assert.strictEqual(actual.code[5], expected[POSTGRES].paragraph.index);
      assert.strictEqual(actual.code[6], expected[POSTGRES].author.fk);
    });
    it('Should generate code for the whole schema in MySQL', () => {
      const actual = main(library, MYSQL, '_foreign._table', '_table._name');
      assert.isFalse(actual.error);
      assert.isArray(actual.code);
      assert.lengthOf(actual.code, 6);
      assert.strictEqual(actual.code[0], expected[MYSQL].book);
      assert.strictEqual(actual.code[1], expected[MYSQL].chapter);
      assert.strictEqual(actual.code[2], expected[MYSQL].paragraph);
      assert.strictEqual(actual.code[3], expected[MYSQL].author.table);
      assert.strictEqual(actual.code[4], expected[MYSQL].book_author);
      assert.strictEqual(actual.code[5], expected[MYSQL].author.fk);
    });
  });

  describe('Generate code for Course', () => {
    it('Should generate code for the whole schema in Postgres', () => {
      const actual = main(course, POSTGRES, '_foreign._table', '_table._name');
      assert.isTrue(actual.error);
      assert.isNull(actual.code);
    });
    it('Should generate code for the whole schema in MySQL', () => {
      const actual = main(course, MYSQL, '_foreign._table', '_table._name');
      assert.isTrue(actual.error);
      assert.isNull(actual.code);
    });
  });
});
