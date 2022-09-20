const Document = require("../models/document.model.js");
const fs = require("fs");

exports.upload = (req, res) => {
  //Verify file
  if (!req.files || !req.body) {
    res.status(400).send({
      message: "Error. No file or content was found."
    });
  }

  //Create directory and move file to directory
  if (!fs.existsSync(__dirname + "/../files/")) {
    fs.mkdirSync(__dirname + "/../files/");
  }
  const file = req.files.file;
  const path = __dirname + "/../files/" + file.name;

  file.mv(path, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.send({ status: "success", path: path });
  });

  //Create document object and put into database
  const document = new Document({
    name: file.name,
    location: path,
    editor: null,
    version_number: 1
  });

  Document.upload(document, (err, data) => {
    if (err)
      res.status(500).send({
        message: "Error trying to upload the document."
      });
    else res.send(data)
  });
};