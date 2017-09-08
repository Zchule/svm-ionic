import { Injectable } from '@angular/core';

import { SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class SqlService{

  db: SQLiteObject = null;

  constructor() {
    console.log('Hello SqlServiceProvider Provider');
  }

  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }
  create(user: any){
    let sql = 'INSERT INTO tasks(name, apPat) VALUES(?,?)';
    return this.db.executeSql(sql, [user.name, user.apPat]);
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, apPat TEXT)';
    return this.db.executeSql(sql, []);
  }

  getAll(){
    let sql = 'SELECT * FROM users';
    return this.db.executeSql(sql, [])
    .then(response => {
      let users = [];
      for (let index = 0; index < response.rows.length; index++) {
        users.push( response.rows.item(index) );
      }
      return Promise.resolve( users );
    })
    .catch(error => Promise.reject(error));
  }
}
