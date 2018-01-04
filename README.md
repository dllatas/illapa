### builder

* **simple** 
nodeJS generates DDL SQL from a JS object. It can be executed into DB via driver. No need for 3rd party software, only JS.

* **single source of truth** 
JS objects are DB schema. However, there is no enforcement that this remains like this.

* **versioning** 
Each schema modification should be a commit. Use only git.

* **opinionated** 
Each JS object has a fixed template, this keeps SQL declarative syntax. No need for an imperative syntax.

* **radical** 
No ALTER syntax supported. DROP - CREATE - LOAD loop.