import documents from '../controllers/document.controller.js';
import { Router } from 'express';

const router = Router();

const DocumentRoutes = (app) => {
  router.get('/', documents.getAll);
  router.get('/:id', documents.getById);
  router.patch('/mark-delete/:id', documents.markForDeletion);
  router.post('/uploadNew', documents.uploadNew);
  router.post('/updateExisting', documents.updateExisting);
  router.post('/save', documents.save);

  app.use('/documents', router);
};

export default DocumentRoutes;
