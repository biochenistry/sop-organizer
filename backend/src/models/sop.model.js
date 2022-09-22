import sql from './db.js';
import fs from 'fs';

const STORAGE_DIR = `${process.env.PROJECT_PATH}/sop-files/`;

const SOP = function (sop) {
  this.name = sop.name;
  this.description = sop.description;
};

SOP.create = (newSop, resultCallback) => {
  sql.query('INSERT INTO sops SET ?', newSop, (err, res) => {
    if (err) {
      if (err.sqlMessage) {
        console.log(`SQL Error: ${err.sqlMessage}`);
      }
      else console.log(`Error: ${err.message}`);

      resultCallback(err, null);
      return;
    }

     // Create directory for future documents to reside here
     const path = `${STORAGE_DIR}/${res.insertId}/`;
     if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
     }

    resultCallback(undefined);
  });
};

SOP.update = (id, updated_sop, resultCallback) => {
  sql.query('UPDATE sops SET ? WHERE id = ?', [updated_sop, id], (err, res) => {
    if (err) {
      if (err.sqlMessage) {
        console.log(`SQL Error: ${err.sqlMessage}`);
      }
      else console.log(`Error: ${err.message}`);

      resultCallback(err, null);
      return;
    }

    resultCallback(undefined);
  });
};

SOP.getAll = (resultCallback) => {
  sql.query('SELECT * FROM sops', (err, res) => {
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

SOP.getById = (id, resultCallback) => {
  sql.query('SELECT * FROM sops WHERE id = ? LIMIT 1', [id], (err, res) => {
    if (err) {
      console.log(`Error: ${err.message}`);
      if (err.sqlMessage) {
        console.log(`SQL Error: ${err.sqlMessage}`);
      }

      resultCallback(err, null);
      return;
    }

    if (!res.length) return resultCallback(new Error('SOP not found'), null);
    resultCallback(undefined, JSON.parse(JSON.stringify(res[0])));
  });
};


SOP.getByName = (name, resultCallback) => {
  sql.query('SELECT * FROM sops WHERE name = ? LIMIT 1', [name], (err, res) => {
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
}

export default SOP;