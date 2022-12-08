import sql from './db.js';
import fs from 'fs';

const STORAGE_DIR = `${process.env.PROJECT_PATH}/sop-files/`;

const Directory = function (directory) {
  this.name = directory.name;
};

Directory.create = (newDir, resultCallback) => {
  
  const path = `${STORAGE_DIR}/${newDir.name}/`;

  if (!fs.existsSync(path)) {
    try {
      fs.mkdirSync(path);
      sql.query('INSERT INTO directories SET ?', newDir, (err) => {
        if (err) {
          console.log(`Error: ${err.message}`);
          if (err.sqlMessage) {
            console.log(`SQL Error: ${err.sqlMessage}`);
          }
    
          resultCallback(err, null);
          return;
        }
        resultCallback(undefined);
      })
    } catch (err) {
      resultCallback(err, null);
    }
  }
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
  sql.query(
    'SELECT * FROM directories WHERE id = ? LIMIT 1',
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
        return resultCallback(new Error('Directory not found'), null);
      resultCallback(undefined, JSON.parse(JSON.stringify(res[0])));
    }
  );
};

Directory.getSopsIdsByDirectoryId = (id, resultCallback) => {
  sql.query(
    'SELECT sop_id FROM directory_sop WHERE directory_id = ?',
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
        return resultCallback(new Error('Directory not found'), null);
      resultCallback(undefined, res);
    }
  );
};

Directory.getAllSOPLinks = (resultCallback) => {
  sql.query(
    'SELECT * FROM directory_sop',
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
        return resultCallback(new Error('No SOP-Document links found'), null);
      resultCallback(undefined, res);
    }
  );
};

Directory.deleteById = (id, name, resultCallback)=> {
  const pathToDelete = `${STORAGE_DIR}/${name}/`;
  try {
    fs.rmSync(pathToDelete, { recursive: true, force: true });
    sql.query('DELETE FROM directories WHERE id = ? LIMIT 1', [id], (err, res) => {
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
  } catch (err) {
    resultCallback(err, null);
  }
};

export default Directory;
