import Document from '../models/document.model.js';

const upload = (req, res) => {
  // Verify file
  if (!req.files || !req.body) {
    res.status(400).send({
      message: 'Error. No file or content was found.',
    });
  }
  const file = req.files.file;

  // Create document object and put into database
  const documentObject = new Document({
    name: file.name,
    location: null,
    editor: null,
    version_number: 1,
  });

  Document.upload(documentObject, file, (err, data) => {
    if (err) {
      res.status(500).send({
        message: 'Error trying to upload the document.',
      });
    } else {
      res.send(data);
    }
  });
};

const getAll = (req, res) => {
  Document.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: 'An error occurred while fetching documents.',
      });
    } else {
      res.send(data);
    }
  });
};

export default { getAll, upload };
