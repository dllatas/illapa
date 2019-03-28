# Illapa

[![Build Status](https://travis-ci.com/dllatas/illapa.svg?branch=master)](https://travis-ci.com/dllatas/illapa)

Utility that transforms config files describing a relational DB schema into the actual SQL code.

Illapa is the Quechua word for lightning. In the Incan mythology, it was believed that the world was divided in three different entitiesi: upper world, "our" world, and lower world. The lightning was a godness able to cross between the upper and "our" world. As it stands with Illapa, the representation level drops from the highest one to a high one: config files to SQL code.

The use case for Illapa is a DROP - CREATE - LOAD loop. It is suitable during development phase, but not good for production and evolving a DB over time.

The library is opinionated since it requires that the config files follow certain structure. Each files is defined by a template.

### Installation
### Flow 

The tables dependency is sorted by using Teseo. In that sense, Teseo can read the files and process it. However, at the moment Teseo does not return the content of the files sorted.


01. input the config files
	- define a dir and the format
	- inject schema as a dependency

02. read files and parse them from config format to js

03. order them using teseo

04. create schema using illapa
### Usage
### Contributing
### Roadmap
### License
### Project Status

### Testing with Docker
POSTGRESS_passeord MIGHT NOT be needed
```
docker run --name pg-test -e POSTGRESS_PASSWORD=admin -d postgres
docker exec -it pg-test psql -U postgres

```


docker run --name mysql-test -e MYSQL_ROOT_HOST=* -e MYSQL_ROOT_PASSWORD=admin -d percona:5
docker exec -it mysql-test bash
bash-4.2$ mysql -u root -p


