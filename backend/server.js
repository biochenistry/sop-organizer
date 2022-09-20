const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors")

const app = express();

app.use(
  fileUpload(), cors()
);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello world." });
});

require("/home/abhuynh/sop-organizer-2/backend/routes/document.routes.js")(app);

const PORT = 8080;
app.listen(PORT, () => {
  console.log('Server is running on port' + PORT + '.');
});