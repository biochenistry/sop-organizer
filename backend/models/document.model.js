const sql = require("./db.js");

const Document = function(document) {
  this.name = document.name;
  this.location = document.location;
  this.editor = document.editor;
  this.version_number = document.version_number;
};

Document.upload = (newDocument, result) => {
  sql.query("INSERT INTO document SET ?", newDocument, (err, res) => {
    if (err) {
      console.log("Error: ", err);
      result(err, null);
      return;
    }
    console.log("Database received a new document: ", { id: res.insertId, ...newDocument });
    // The line below is broken for some reason. Perhaps we don't need it.
    // result(null, { id: res.insertId, ...newDocument }); 
  });
};

module.exports = Document;
