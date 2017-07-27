# schema builder

* tired of using 3rd party software to design and generate a DB schema ?? :tired_face:
* SQL file never has the latest version ?? :angry:
* unclear documentation of other schema builders ?? :cry:
* SQL is declarative, no need for JS imperative syntax to generate a schema :no_mouth:

### principles

* **simple:** schema object generates SQL code, SQL code runs in MySQL. only js.
* **single source of truth:** schema object is the db schema, always last version.
* **versioning:** each schema modification should be a commit (use git, no need for other vcs)
* **opinionated:** schema object has a fixed template (declarative syntax)
* **radical:** no ALTER syntax supported. DROP - CREATE - LOAD loop.


### todo 

1. post building scripts (self referencing fk)
2. drop tables script ()
3. support for other DB: Maria and PostgreSQL
4. add tests
