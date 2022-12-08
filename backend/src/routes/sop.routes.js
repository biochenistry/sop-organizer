import sops from '../controllers/sop.controller.js';
import { Router } from 'express';

const router = Router();

const SOPRoutes = (app) => {
  
  /**
   * @swagger
   * /sops:
   *   get:
   *     summary: Gets all SOPs
   *     tags: 
   *       - sops
   *     responses:
   *       200:
   *         description: Returns an array of all SOP objects.
   */
  router.get('/', sops.getAll);

  /**
   * @swagger
   * /sops/:id:
   *   get:
   *     summary: Gets a single SOP
   *     tags: 
   *       - sops
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the sop to get
   *     responses:
   *       200:
   *         description: Returns the sop with the specified id.
   */
  router.get('/:id', sops.getById);
  
  /**
   * @swagger
   * /sops:
   *   post:
   *     summary: Creates an SOP; API not supported
   *     tags: 
   *       - sops
   *     responses:
   *       200:
   *         description: Returns the SOP created.
   */
  router.post('/', sops.create);
  
  /**
   * @swagger
   * /sops/:id:
   *   patch:
   *     summary: Patches an SOP
   *     tags: 
   *       - sops
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the SOP to patch
   *     responses:
   *       200:
   *         description: Returns the patched SOP.
   */
  router.patch('/:id', sops.update);
  
  /**
   * @swagger
   * /sops/search/:searchTerm:
   *   get:
   *     summary: Searches for SOPs by content
   *     tags: 
   *       - sops
   *     parameters:
   *      - in: path
   *        name: searchTerm
   *        schema:
   *          type: string
   *        required: true
   *        description: Term that SOPs should contain
   *     responses:
   *       200:
   *         description: Returns the sop containing the specified content.
   */
  router.get('/search/:searchTerm', sops.getAllFilteredByContent);
  
  /**
   * @swagger
   * /sops/changeDirectory:
   *   get:
   *     summary: Gets a single SOP
   *     tags: 
   *       - sops
   *     parameters:
   *      - in: formData
   *        name: sop_id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the sop to change directories
   *      - in: formData
   *        name: old_directory_id
   *        schema:
   *          type: integer
   *        required: true
   *        description: Old ID of the directory
   *      - in: formData
   *        name: new_directory_id
   *        schema:
   *          type: integer
   *        required: true
   *        description: New ID of the directory
   *     responses:
   *       200:
   *         description: Returns the sop with the specified id.
   */
  router.post('/changeDirectory', sops.changeDirectory);

  /**
   * @swagger
   * /sops:
   *   delete:
   *     summary: Deletes a SOP
   *     tags: 
   *       - sops
   *     parameters:
   *      - in: formData
   *        name: SOP id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the sop to delete
   *      - in: formData
   *        name: Directory name
   *        schema:
   *          type: string
   *        required: true
   *        description: Directory of the sop to delete
   *     responses:
   *       200:
   *         description: Returns the sop deleted.
   */
  router.delete('/', sops.deleteSop)

  app.use('/sops', router);
};

export default SOPRoutes;
