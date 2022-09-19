const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors")
const fs = require("fs");
const port = 2468

const app = express();

app.use(
  fileUpload(), cors()
);

app.post("/upload", (req, res) => {
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }
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
});

app.listen(port, () => {
  console.log('Listening')
})