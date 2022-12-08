import documents from '../controllers/document.controller.js';
import { Router } from 'express';

const router = Router();

const DocumentRoutes = (app) => {
  
  /**
   * @swagger
   * /documents:
   *   get:
   *     summary: Gets all documents
   *     tags: 
   *       - documents
   *     responses:
   *       200:
   *         description: Returns an array of all document objects.
   */
  router.get('/', documents.getAll);
  
  /**
   * @swagger
   * /documents/:id:
   *   get:
   *     summary: Gets a single document
   *     tags: 
   *       - documents
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the document to get
   *     responses:
   *       200:
   *         description: Returns the document with the specified id.
   */
  router.get('/:id', documents.getById);
  
  /**
   * @swagger
   * /documents/mark-delete/:id:
   *   patch:
   *     summary: Marks a single document for deletion
   *     tags: 
   *       - documents
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the document to mark for deletion
   *     responses:
   *       200:
   *         description: Returns the document to be marked for deletion.
   */
  router.patch('/mark-delete/:id', documents.markForDeletion);
  
  /**
   * @swagger
   * /documents/:id:
   *   delete:
   *     summary: Deletes a document
   *     tags: 
   *       - documents
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the document to delete
   *     responses:
   *       200:
   *         description: Returns the document deleted.
   */
  router.delete('/delete/:id', documents.deleteDocument);
  
  /**
   * @swagger
   * /documents/uploadNew:
   *   post:
   *     summary: Upload a new document; API not supported
   *     tags: 
   *       - documents
   *     responses:
   *       200:
   *         description: Returns the document to uploaded.
   */
  router.post('/uploadNew', documents.uploadNew);
  
  /**
   * @swagger
   * /documents/updateExisting:
   *   post:
   *     summary: Updates an existing document; API not supported
   *     tags: 
   *       - documents
   *     responses:
   *       200:
   *         description: Returns the updated document.
   */
  router.post('/updateExisting', documents.updateExisting);
  
  /**
   * @swagger
   * /documents/save:
   *   post:
   *     summary: Save changes to a document; API not supported
   *     tags: 
   *       - documents
   *     responses:
   *       200:
   *         description: Returns the saved document.
   */
  router.post('/save', documents.save);
  
  /**
   * @swagger
   * /documents/download:
   *   post:
   *     summary: Downloads a document; API not supported
   *     tags: 
   *       - documents
   *     responses:
   *       200:
   *         description: Returns the downloaded document.
   */
  router.post('/download', documents.download);
  
  /**
   * @swagger
   * /documents/afterDownload:
   *   post:
   *     summary: Deletes the converted .docx file; API not supported
   *     tags: 
   *       - documents
   *     responses:
   *       200:
   *         description: Returns ''
   */
  router.delete('/afterDownload', documents.afterDownload);

  app.use('/documents', router);
};

export default DocumentRoutes;
