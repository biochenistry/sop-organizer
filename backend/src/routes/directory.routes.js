import Directory from '../controllers/directory.controller.js';
import { Router } from 'express';

const router = Router();

const DirectoryRoutes = (app) => {
  
  /**
   * @swagger
   * /directory:
   *   get:
   *     summary: Gets all directories
   *     tags: 
   *       - directory
   *     responses:
   *       200:
   *         description: Returns an array of all directory objects.
   */
  router.get('/', Directory.getAll);
  
  /**
   * @swagger
   * /directory/:id:
   *   get:
   *     summary: Gets a single directory
   *     tags: 
   *       - directory
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the directory to get
   *     responses:
   *       200:
   *         description: Returns the directory with the specified id.
   */
  router.get('/:id', Directory.getById);
  
  /**
   * @swagger
   * /directory:
   *   post:
   *     summary: Creates a single directory
   *     tags: 
   *       - directory
   *     parameters:
   *      - in: formData
   *        name: directory object with name as a key and the name of the directory as a string
   *        schema:
   *          type: JSON
   *        required: true
   *        description: JSON for a directory
   *     responses:
   *       200:
   *         description: Returns an array of directory objects.
   */
  router.post('/', Directory.create);
  
  /**
   * @swagger
   * /directory/getSops/:id:
   *   get:
   *     summary: Gets the SOPs in a directory
   *     tags: 
   *       - directory
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the directory to get
   *     responses:
   *       200:
   *         description: Returns an array of SOP objects.
   */
  router.get('/getSops/:id', Directory.getSopsIdsByDirectoryId);
  
  /**
   * @swagger
   * /directory/:id:
   *   delete:
   *     summary: Deletes a directory
   *     tags: 
   *       - directory
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the directory to delete
   *     responses:
   *       200:
   *         description: Returns the directory deleted.
   */
  router.delete('/:id', Directory.deleteById);  

  app.use('/directory', router);
};

export default DirectoryRoutes;
