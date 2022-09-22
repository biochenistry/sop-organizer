import sql from './db.js';
import fs from 'fs';

const STORAGE_DIR = `${process.env.PROJECT_PATH}/sop-files/`;

const Document = function (document) {
  this.original_file_name = document.original_file_name;
  this.location = document.location;
  this.editor_id = document.editor_id;
  this.sop_id = document.sop_id;
  this.version_number = document.version_number;
};

Document.upload = (newDocument, file, resultCallback) => {
  sql.query('INSERT INTO documents SET ?', newDocument, (err, res) => {
    if (err) {
      console.log(`Error: ${err}`);
      resultCallback(err, null);
      return;
    }

    // Create SOP directory (if it doesn't exist) and move file to directory
    const path = `${STORAGE_DIR}/${newDocument.sop_id}/`;
    const relativePath = `${newDocument.sop_id}/`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    // Determine the new file name based on the version and the document extension
    const newFileName = `${newDocument.version_number}.${file.name.split(".").slice(-1)[0]}`;

    file.mv(`${path}/${newFileName}`, (err) => {
      if (err) return res.status(500).send(err);
    });

    sql.query(
      'UPDATE documents SET location = ? WHERE id = ?',
      [`${relativePath}${newFileName}`, res.insertId],
      (err) => {
      // (err, res) => {
        if (err) {
          console.log('Error: ', err);
          resultCallback(err, null);
          return;
        }
      }
    );

    console.log('Database received a new document: ', {
      id: res.insertId,
      ...newDocument,
    });
  
    resultCallback(null, { id: res.insertId, ...newDocument });
  });
};

Document.getById = (id, resultCallback) => {
  sql.query('SELECT * FROM documents WHERE id = ? LIMIT 1', [id], (err, res) => {
    if (err) {
      console.log(`Error: ${err.message}`);
      if (err.sqlMessage) {
        console.log(`SQL Error: ${err.sqlMessage}`);
      }

      resultCallback(err, null);
      return;
    }

    if (!res.length) return resultCallback(new Error('Document not found'), null);
    resultCallback(undefined, JSON.parse(JSON.stringify(res[0])));
  });
};

Document.getAll = (resultCallback) => {
  sql.query('SELECT * FROM documents', (err, res) => {
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
