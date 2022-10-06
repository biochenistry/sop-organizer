import Directory from '../models/directory.model.js'

const create = (req, res) => {
    if (!req.body) {
      res.status(400).send({ message: 'No Directory found in request body.' });
      return;
    }
  
    const newDir = new Directory(req.body);
  
    Directory.create(newDir, (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(409).send({ message: "Error: Duplicate directories detected." })
        }
        else {
          res.status(500).send({
            message: 'An error occurred while creating the directory.',
          });
        }
      } else {
        res.sendStatus(201);
      }
    });
  };

  const getAll = (req, res) => {
    Directory.getAll((err, data) => {
      if (err) {
        res.status(500).send({
          message: 'An error occurred while fetching directories.',
        });
      } else {
        res.send(data);
      }
    });
  };
  
  const getById = (req, res) => {
    Directory.getById(req.params.id, (err, dir) => {
      if (err) {
        res.status(500).send({
          message: "An error occurred while fetching the directory.",
        });
        return;
      }
      res.send(dir);
    });
  };

export default { create , getAll, getById};
