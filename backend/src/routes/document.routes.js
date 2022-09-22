import documents from '../controllers/document.controller.js';
import { Router } from 'express';

const router = Router();

const DocumentRoutes = (app) => {
  router.get('/', documents.getAll);
  router.get('/:id', documents.getById);
  router.post('/upload', documents.upload);

  app.use('/documents', router);
};

export default DocumentRoutes;
