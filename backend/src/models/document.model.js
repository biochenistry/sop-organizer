import sql from './db.js';
import fs from 'fs';

const Document = function (document) {
  this.name = document.name;
  this.location = document.location;
  this.editor = document.editor;
  this.version_number = document.version_number;
};

Document.upload = (newDocument, file, result) => {
  sql.query('INSERT INTO document SET ?', newDocument, (err, res) => {
    if (err) {
      console.log('Error: ', err);
      result(err, null);
      return;
    }

    //Create directory and move file to directory
    const path = __dirname + '/../../../sop-files/' + res.insertId + '/';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    console.log(path + file.name);

    file.mv(path + file.name, (err) => {
      if (err) return res.status(500).send(err);
    });

    sql.query(
      'UPDATE document SET location = ? WHERE id = ?',
      [path + file.name, res.insertId],
      // (err, res) => {
      (err) => {
        if (err) {
          console.log('Error: ', err);
          result(err, null);
          return;
        }
      }
    );

    console.log('Database received a new document: ', {
      id: res.insertId,
      ...newDocument,
    });
    // The line below is broken for some reason. Perhaps we don't need it.
    // result(null, { id: res.insertId, ...newDocument });
  });
};

Document.getAll = (resultCallback) => {
  sql.query('SELECT * FROM document', (err, res) => {
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

export default Document;
