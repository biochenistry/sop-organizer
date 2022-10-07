import sql from './db.js';
import fs from 'fs';

const STORAGE_DIR = `${process.env.PROJECT_PATH}/sop-files/`;

const Directory = function (directory) {
  this.name = directory.name;
};

Directory.create = (newDir, resultCallback) => {
    sql.query('INSERT INTO directories SET ?', newDir, (err, res) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        if (err.sqlMessage) {
          console.log(`SQL Error: ${err.sqlMessage}`);
        }
  
        resultCallback(err, null);
        return;
      }

    const path = `${STORAGE_DIR}/${res.insertId}/`;
     if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
     }

      resultCallback(undefined);
    });
  };

  Directory.getAll = (resultCallback) => {
    sql.query('SELECT * FROM directories', (err, res) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        if (err.sqlMessage) {
          console.log(`SQL Error: ${err.sqlMessage}`);
        }
  
        resultCallback(err, null);
        return;
      }
  
      resultCallback(undefined, res);
    });
  };
  
  Directory.getById = (id, resultCallback) => {
    sql.query('SELECT * FROM directories WHERE id = ? LIMIT 1', [id], (err, res) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        if (err.sqlMessage) {
          console.log(`SQL Error: ${err.sqlMessage}`);
        }
  
        resultCallback(err, null);
        return;
      }
  
      if (!res.length) return resultCallback(new Error('Directory not found'), null);
      resultCallback(undefined, JSON.parse(JSON.stringify(res[0])));
    });
  };

export default Directory;