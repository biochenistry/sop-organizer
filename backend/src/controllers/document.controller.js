import Document from '../models/document.model.js';
import SOP from '../models/sop.model.js';

const upload = (req, res) => {
  // Verify file
  if (!req.files || !req.body) {
    res.status(400).send({
      message: 'Error. No file or content was found.',
    });
  }

  const file = req.files.file;
  const sopId = req.body.sop_id;
  const editorId = req.body.editor_id;

  // find the latest version number to incremenet it
  SOP.getById(req.body.sop_id, (err, sop) => {
    if (err) return res.status(500).send({ message: 'An error occurred finding the linked SOP. Please retry upload.' });

    // Create document object and put into database
    const documentObject = new Document({
      original_file_name: file.name,
      location: null, // this gets updated below
      editor_id: editorId,
      sop_id: sopId,
      version_number: sop.latest_version_number + 1,
    });
  
    Document.upload(documentObject, file, (err, data) => {
      if (err) {
        res.status(500).send({
          message: 'Error trying to upload the document.',
        });
        return;
      }
  
      // Update the `latest_version_number` column on the SOP
      SOP.update(sopId, { latest_version_number: sop.latest_version_number + 1 }, (err) => {
        if (err) {
          res.status(500).send({
            message: 'Error trying to upload the document.',
          });
          return;
        }
        res.send(data);
      });
    });
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

const getById = (req, res) => {
  Document.getById(req.params.id, (err, document) => {
    if (err) {
      res.status(500).send({
        message: "An error occurred while fetching a document.",
      });
      return;
    }
    res.send(document);
  });
};

export default { getAll, getById, upload };
