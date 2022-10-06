import Directory from '../controllers/directory.controller.js';
import { Router } from 'express';

const router = Router();

const DirectoryRoutes = (app) => {
  router.get('/', Directory.getAll);
  router.get('/:id', Directory.getById);
  router.post('/', Directory.create);

  app.use('/directory', router);
};

export default DirectoryRoutes;
