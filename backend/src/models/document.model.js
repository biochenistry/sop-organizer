import sql from './db.js';
import fs from 'fs';
import { exec } from 'child_process';

const STORAGE_DIR = `${process.env.PROJECT_PATH}/sop-files/`;
const PANDOC_DIR = `${process.env.PANDOC_PATH}`;

const Document = function (document) {
  this.original_file_name = document.original_file_name;
  this.location = document.location;
  this.editor_id = document.editor_id;
  this.sop_id = document.sop_id;
  this.version_number = document.version_number;
};

Document.uploadNew = (newDocument, file, directoryName, resultCallback) => {
  sql.query('INSERT INTO documents SET ?', newDocument, (err, res) => {
    if (err) {
      console.log(`Error: ${err}`);
      resultCallback(err, null);
      return;
    }

    // Move document into the specified directory under the given SOP id
    const path = `${STORAGE_DIR}/${directoryName}/${newDocument.sop_id}/`;
    const relativePath = `${directoryName}/${newDocument.sop_id}/`;

    // Determine the new file name based on the version and the document extension
    const newFileName = `${newDocument.version_number}.${
      file.name.split('.').slice(-1)[0]
    }`;

    file.mv(`${path}/${newFileName}`, (err) => {
      if (err) return res.status(500).send(err);

      console.log(
        `${PANDOC_DIR} ` +
          (path + newFileName) +
          ' -o ' +
          path +
          newFileName.substring(0, newFileName.lastIndexOf('.')) +
          '.html'
      );
      exec(
        `${PANDOC_DIR} ` +
          (path + newFileName) +
          ' -o ' +
          path +
          newFileName.substring(0, newFileName.lastIndexOf('.')) +
          '.html',
        function (error, stdOut, stdErr) {
          if (error !== null) {
            console.log('exec error: ' + error);
            console.log('stdout: ' + stdOut);
            console.log('stderr: ' + stdErr);
          }
          sql.query(
            'UPDATE documents SET location = ? WHERE id = ?',
            [`${relativePath}`, res.insertId],
            (err) => {
              if (err) {
                console.log('Error: ', err);
                resultCallback(err, null);
                return;
              }
              console.log('Database received a new document: ', {
                id: res.insertId,
                ...newDocument,
              });
              resultCallback(null, { id: res.insertId, ...newDocument });
            }
          );
        }
      );
    });
  });
};

Document.updateExisting = (
  newDocument,
  file,
  directoryName,
  resultCallback
) => {
  sql.query('INSERT INTO documents SET ?', newDocument, (err, res) => {
    if (err) {
      console.log(`Error: ${err}`);
      resultCallback(err, null);
      return;
    }

    // Move document into directory
    const path = `${STORAGE_DIR}/${directoryName}/${newDocument.sop_id}/`;
    const relativePath = `${directoryName}/${newDocument.sop_id}/`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    // Determine the new file name based on the version and the document extension
    const newFileName = `${newDocument.version_number}.${
      file.name.split('.').slice(-1)[0]
    }`;

    file.mv(`${path}/${newFileName}`, (err) => {
      if (err) {
        console.log(`Error: ${err}`);
        resultCallback(err, null);
        return;
      } else {
        // console.log(`${PANDOC_DIR} ` + (path + newFileName) + ' -o ' + path + newFileName.substring(0, newFileName.lastIndexOf('.')) + '.html');
        exec(
          `${PANDOC_DIR} ` +
            (path + newFileName) +
            ' -o ' +
            path +
            newFileName.substring(0, newFileName.lastIndexOf('.')) +
            '.html',
          function (error, stdOut, stdErr) {
            if (error !== null) {
              console.log('stdout: ' + stdOut);
              console.log('stderr: ' + stdErr);
              console.log('pandoc error: ' + error);
              resultCallback(err, null);
              return;
            }
            sql.query(
              'UPDATE documents SET location = ? WHERE id = ?',
              [`${relativePath}`, res.insertId],
              (err) => {
                if (err) {
                  console.log('Error: ', err);
                  resultCallback(err, null);
                  return;
                } else {
                  sql.query(
                    'UPDATE sops SET latest_version_document_id = ? WHERE id = ?',
                    [res.insertId, newDocument.sop_id],
                    (err) => {
                      if (err) {
                        console.log('Error: ', err);
                        resultCallback(err, null);
                        return;
                      } else {
                        newDocument.location = `${relativePath}`;
                        console.log('Database received a new document: ', {
                          id: res.insertId,
                          ...newDocument,
                        });
                        resultCallback(undefined, res);
                        return;
                      }
                    }
                  );
                }
              }
            );
          }
        );
      }
    });
  });
};

Document.save = (newDocument, file, directoryName, resultCallback) => {
  sql.query('INSERT INTO documents SET ?', newDocument, (err, res) => {
    if (err) {
      console.log(`Error: ${err}`);
      resultCallback(err, null);
      return;
    }

    // Create path for file
    const path = `${STORAGE_DIR}/${directoryName}/${newDocument.sop_id}/`;
    const relativePath = `${directoryName}/${newDocument.sop_id}/`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    // Determine the new file name based on the version and the document extension
    const newFileName = `${newDocument.version_number}.${
      file.name.split('.').slice(-1)[0]
    }`;

    file.mv(`${path}/${newFileName}`, (err) => {
      if (err) return res.status(500).send(err);
      else {
        sql.query(
          'UPDATE documents SET location = ? WHERE id = ?',
          [`${relativePath}`, res.insertId],
          (err) => {
            if (err) {
              console.log('Error: ', err);
              resultCallback(err, null);
              return;
            } else {
              sql.query(
                'UPDATE sops SET latest_version_document_id = ? WHERE id = ?',
                [res.insertId, newDocument.sop_id],
                (err) => {
                  if (err) {
                    console.log('Error: ', err);
                    resultCallback(err, null);
                    return;
                  } else {
                    newDocument.location = `${relativePath}`;
                    console.log('Database received a new document: ', {
                      id: res.insertId,
                      ...newDocument,
                    });
                    resultCallback(undefined, res);
                    return;
                  }
                }
              );
            }
          }
        );
      }
    });
  });
};

Document.getById = (id, resultCallback) => {
  sql.query(
    'SELECT * FROM documents WHERE id = ? LIMIT 1',
    [id],
    (err, res) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        if (err.sqlMessage) {
          console.log(`SQL Error: ${err.sqlMessage}`);
        }

        resultCallback(err, null);
        return;
      }

      if (!res.length)
        return resultCallback(new Error('Document not found'), null);
      resultCallback(undefined, JSON.parse(JSON.stringify(res[0])));
    }
  );
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

Document.markForDeletion = (id, userId, resultCallback) => {
  sql.query(
    'UPDATE documents SET marked_for_deletion_by_user_id = ? WHERE id = ?',
    [userId, id],
    (err, res) => {
      if (err) {
        console.log(`Error: ${err.message}`);
        if (err.sqlMessage) {
          console.log(`SQL Error: ${err.sqlMessage}`);
        }

        resultCallback(err, null);
        return;
      }

      resultCallback(undefined, res);
    }
  );
};

export default Document;
