'use strict';
const sqlite = require('sqlite3');

const db = new sqlite.Database('surveydb.db', (err) => {
  if(err) throw err;
});
const bcrypt = require('bcrypt');

exports.getAdmin = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ADMINS WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const admin = {id: row.ID, username: row.email, name: row.name};
                
        bcrypt.compare(password, row.password).then(result => {
          if(result) 
            resolve(admin);
          else 
            resolve(false);
        });
      }
    });
  });
};

exports.getAdminById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ADMINS WHERE ID = ?';
    db.get(sql, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'User not found!'}); 
      }
      else {
        const admin = {id: row.ID, username: row.email, name: row.name};
        resolve(admin);
      }
    });
  });
};