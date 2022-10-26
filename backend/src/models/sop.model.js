import sql from './db.js';
import fs from 'fs';
// import fs from 'fs-extra';

const STORAGE_DIR = `${process.env.PROJECT_PATH}/sop-files`;

const SOP = function (sop) {
  this.name = sop.name;
  this.latest_version_number = sop.latest_version_number;
  this.description = sop.description;
};

const DIRECTORY_SOP = function (directory_sop) {
  this.directory_id = directory_sop.directory_id;
  this.sop_id = directory_sop.sop_id;
};

SOP.create = (newSop, directoryName, resultCallback) => {
  sql.query('INSERT INTO sops SET ?', newSop, (err, res) => {
    if (err) {
      if (err.sqlMessage) {
        console.log(
          `SQL Error with inserting sop into database: ${err.sqlMessage}`
        );
      } else console.log(`Error: ${err.message}`);

      resultCallback(err, null);
      return;
    }

    const sop_id = res.insertId;

    // Create a sub-directory for future documents/revisions to reside
    const path = `${STORAGE_DIR}/${directoryName}/${sop_id}/`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    // Put this sop <-> directory relationship into the directory_sop table
    sql.query(
      'SELECT id FROM directories WHERE name = ? LIMIT 1',
      [directoryName],
      (err, res2) => {
        const directory_id = res2[0].id;
        if (err) {
          console.log(`Error: ${err.message}`);
          if (err.sqlMessage) {
            console.log(
              `SQL Error updating sop-directory table: ${err.sqlMessage}`
            );
          }
          resultCallback(err, null);
          return;
        }

        const directorySopObject = new DIRECTORY_SOP({
          directory_id: directory_id,
          sop_id: sop_id,
        });
        sql.query(
          'INSERT INTO directory_sop SET ?',
          directorySopObject,
          (err) => {
            if (err) {
              if (err.sqlMessage) {
                console.log(`SQL Error: ${err.sqlMessage}`);
              } else console.log(`Error: ${err.message}`);

              resultCallback(err, null);
              return;
            }
          }
        );
      }
    );
    resultCallback(undefined, res);
  });
};

SOP.update = (id, updated_sop, resultCallback) => {
  sql.query('UPDATE sops SET ? WHERE id = ?', [updated_sop, id], (err) => {
    if (err) {
      if (err.sqlMessage) {
        console.log(`SQL Error: ${err.sqlMessage}`);
      } else console.log(`Error: ${err.message}`);

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
};

SOP.changeDirectory = (sop_id, oldDirectory, newDirectory, resultCallback) => {
  console.log(sop_id);
  console.log(oldDirectory);
  console.log(newDirectory);
  const oldPath = `${STORAGE_DIR}/${oldDirectory.name}/${sop_id}/`;
  const newPath = `${STORAGE_DIR}/${newDirectory.name}/${sop_id}/`;
  const relativeNewPath = `${newDirectory.name}/${sop_id}/`;

  console.log(oldPath);
  console.log(newPath);
  fs.move(oldPath, newPath, { overwrite: true }, (err) => {
    if (err) {
      console.log('Error changing SOP directory');
      resultCallback(err);
    }

    sql.query(
      'UPDATE directory_sop SET directory_id = ? WHERE sop_id = ?',
      [newDirectory.id, sop_id],
      (err) => {
        if (err) {
          if (err.sqlMessage) {
            console.log(`SQL Error: ${err.sqlMessage}`);
          } else console.log(`Error: ${err.message}`);
          resultCallback(err);
          return;
        }
        sql.query(
          'UPDATE documents SET location = ? WHERE sop_id = ?',
          [relativeNewPath, sop_id],
          (err) => {
            if (err) {
              if (err.sqlMessage) {
                console.log(`SQL Error: ${err.sqlMessage}`);
              } else console.log(`Error: ${err.message}`);
              resultCallback(err);
              return;
            }
          }
        );
      }
    );
  });
};
export default SOP;
