const { describe, it } = require('mocha');
const { assert } = require('chai');

const analysis = require('../src/analysis');
const synthesis = require('../src/synthesis');

const { library } = require('./schema');

const POSTGRES = 'pg';
const MYSQL = 'mysql';


describe('Synthesis test module', () => {
  describe('Generate code for library.book', () => {
    const table = 'book';
    it('Should generate columns and PK DDL code for Postgres', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = 'CREATE TABLE IF NOT EXISTS book (id SERIAL NOT NULL, title VARCHAR(1000) NOT NULL, PRIMARY KEY (id));';
      const actual = synthesis(analyzed, POSTGRES);
      assert.isArray(actual);
      assert.lengthOf(actual, 1);
      assert.strictEqual(actual[0], expected);
    });
    it('Should generate columns and PK DDL code for MySQL', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = 'CREATE TABLE IF NOT EXISTS book (id INT(11) NOT NULL AUTO_INCREMENT, title VARCHAR(1000) NOT NULL, PRIMARY KEY (id));';
      const actual = synthesis(analyzed, MYSQL);
      assert.isArray(actual);
      assert.lengthOf(actual, 1);
      assert.strictEqual(actual[0], expected);
    });
  });
  describe('Generate code for library.chapter', () => {
    const table = 'chapter';
    it('Should generate columns, PK and FK DDL code for Postgres', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = 'CREATE TABLE IF NOT EXISTS chapter (id SERIAL NOT NULL, book_id SERIAL NOT NULL, title VARCHAR(1000) NOT NULL, PRIMARY KEY (id), CONSTRAINT fk_chapter_book FOREIGN KEY (book_id) REFERENCES book (id)  ON DELETE CASCADE  ON UPDATE CASCADE);';
      const actual = synthesis(analyzed, POSTGRES);
      assert.isArray(actual);
      assert.lengthOf(actual, 1);
      assert.strictEqual(actual[0], expected);
    });
    it('Should generate columns, PK and FK DDL code for MySQL', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = 'CREATE TABLE IF NOT EXISTS chapter (id INT(11) NOT NULL AUTO_INCREMENT, book_id INT(11) NOT NULL AUTO_INCREMENT, title VARCHAR(1000) NOT NULL, PRIMARY KEY (id), CONSTRAINT fk_chapter_book FOREIGN KEY (book_id) REFERENCES book (id)  ON UPDATE CASCADE  ON DELETE CASCADE);';
      const actual = synthesis(analyzed, MYSQL);
      assert.isArray(actual);
      assert.lengthOf(actual, 1);
      assert.strictEqual(actual[0], expected);
    });
  });
  describe('Generate code for library.paragraph', () => {
    const table = 'paragraph';
    it('Should generate columns, PK, index and FK DDL code for Postgres', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = {
        table: 'CREATE TABLE IF NOT EXISTS paragraph (id SERIAL NOT NULL, chapter_id SERIAL NOT NULL, text VARCHAR(1000) NOT NULL, PRIMARY KEY (id), CONSTRAINT idx_uq_paragraph_text UNIQUE (text), CONSTRAINT fk_paragraph_chapter FOREIGN KEY (chapter_id) REFERENCES chapter (id)  ON DELETE CASCADE  ON UPDATE CASCADE);',
        index: 'CREATE INDEX idx_paragraph_chapter_id ON paragraph (chapter_id);',
      };
      const actual = synthesis(analyzed, POSTGRES);
      assert.isArray(actual);
      assert.lengthOf(actual, 2);
      assert.strictEqual(actual[0], expected.table);
      assert.strictEqual(actual[1], expected.index);
    });
    it('Should generate columns, PK, index and FK DDL code for MySQL', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = 'CREATE TABLE IF NOT EXISTS paragraph (id INT(11) NOT NULL AUTO_INCREMENT, chapter_id INT(11) NOT NULL AUTO_INCREMENT, text VARCHAR(1000) NOT NULL, PRIMARY KEY (id), UNIQUE INDEX idx_uq_paragraph_text(text), INDEX idx_paragraph_chapter_id(chapter_id), CONSTRAINT fk_paragraph_chapter FOREIGN KEY (chapter_id) REFERENCES chapter (id)  ON UPDATE CASCADE  ON DELETE CASCADE);';
      const actual = synthesis(analyzed, MYSQL);
      assert.isArray(actual);
      assert.lengthOf(actual, 1);
      assert.strictEqual(actual[0], expected);
    });
  });
  describe('Generate code for library.book_author', () => {
    const table = 'book_author';
    it('Should generate columns, PK, index and FK DDL code for Postgres and parse object to array', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = {
        table: 'CREATE TABLE IF NOT EXISTS book_author (book_id SERIAL NOT NULL, author_id SERIAL NOT NULL, PRIMARY KEY (book_id, author_id), CONSTRAINT fk_book_author_book FOREIGN KEY (book_id) REFERENCES book (id)  ON DELETE CASCADE  ON UPDATE CASCADE, CONSTRAINT fk_book_author_author FOREIGN KEY (author_id) REFERENCES author (id)  ON DELETE CASCADE  ON UPDATE CASCADE);',
      };
      const actual = synthesis(analyzed[0], POSTGRES);
      assert.isArray(actual);
      assert.lengthOf(actual, 1);
      assert.strictEqual(actual[0], expected.table);
    });
    it('Should generate columns, PK, index and FK DDL code for MySQL', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = 'CREATE TABLE IF NOT EXISTS book_author (book_id INT(11) NOT NULL AUTO_INCREMENT, author_id INT(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (book_id, author_id), CONSTRAINT fk_book_author_book FOREIGN KEY (book_id) REFERENCES book (id)  ON UPDATE CASCADE  ON DELETE CASCADE, CONSTRAINT fk_book_author_author FOREIGN KEY (author_id) REFERENCES author (id)  ON UPDATE CASCADE  ON DELETE CASCADE);';
      const actual = synthesis(analyzed, MYSQL);
      assert.isArray(actual);
      assert.lengthOf(actual, 1);
      assert.strictEqual(actual[0], expected);
    });
  });
  describe('Generate code for library.author', () => {
    const table = 'author';
    it('Should generate columns, PK, index, recursive FK and FK DDL code for Postgres and parse object to array', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = {
        table: 'CREATE TABLE author (id SERIAL NOT NULL, author_id INT NULL, fname VARCHAR(100) NOT NULL, lname VARCHAR(100) NOT NULL, PRIMARY KEY (id), CONSTRAINT idx_uq_author_fname UNIQUE (fname), CONSTRAINT idx_uq_author_lname UNIQUE (lname));',
        fk: 'ALTER TABLE author ADD CONSTRAINT fk_author_author FOREIGN KEY (author_id) REFERENCES author (id)  ON DELETE CASCADE  ON UPDATE CASCADE;',
      };
      const actual = synthesis(analyzed[0], POSTGRES);
      assert.isArray(actual);
      assert.lengthOf(actual, 2);
      assert.strictEqual(actual[0], expected.table);
      assert.strictEqual(actual[1], expected.fk);
    });
    it('Should generate columns, PK, index and FK DDL code for MySQL', () => {
      const analyzed = analysis(library.filter(l => l._table._name === table));
      const expected = {
        table: 'CREATE TABLE author (id INT(11) NOT NULL AUTO_INCREMENT, author_id INT(11) NULL, fname VARCHAR(100) NOT NULL, lname VARCHAR(100) NOT NULL, PRIMARY KEY (id), UNIQUE INDEX idx_uq_author_fname(fname), UNIQUE INDEX idx_uq_author_lname(lname));',
        fk: 'ALTER TABLE author ADD CONSTRAINT fk_author_author FOREIGN KEY (author_id) REFERENCES author (id)  ON DELETE CASCADE  ON UPDATE CASCADE;',
      };
      const actual = synthesis(analyzed, MYSQL);
      assert.isArray(actual);
      assert.lengthOf(actual, 2);
      assert.strictEqual(actual[0], expected.table);
      assert.strictEqual(actual[1], expected.fk);
    });
  });
});
