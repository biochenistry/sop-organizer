import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import DocumentRoutes from './routes/document.routes.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(fileUpload(), cors());

// default route - returns the API version
app.get('/', (req, res) => {
  res.json({ version: process.env.npm_package_version });
});

// register other routes
DocumentRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
