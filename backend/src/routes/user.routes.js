import users from '../controllers/user.controller.js';
import { Router } from 'express';

const router = Router();

const UserRoutes = (app) => {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Gets all users
   *     tags: 
   *       - users
   *     responses:
   *       200:
   *         description: Returns an array of all user objects.
   */
  router.get('/', users.getAll);

  /**
   * @swagger
   * /users/:id:
   *   get:
   *     summary: Gets a users sop
   *     tags: 
   *       - users
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the users to get
   *     responses:
   *       200:
   *         description: Returns the users with the specified id.
   */
  router.get('/:id', users.getById);
  
  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Creates an user; API not supported
   *     tags: 
   *       - users
   *     responses:
   *       200:
   *         description: Returns the user created.
   */
  router.post('/', users.create);

  /**
   * @swagger
   * /users/:id:
   *   patch:
   *     summary: Patches a user
   *     tags: 
   *       - users
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the user to patch
   *     responses:
   *       200:
   *         description: Returns the patched user.
   */
  router.patch('/:id', users.update);

  /**
   * @swagger
   * /users:
   *   delete:
   *     summary: Deletes a user
   *     tags: 
   *       - users
   *     parameters:
   *      - in: formData
   *        name: SOP id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the user to delete
   *     responses:
   *       200:
   *         description: Returns the user deleted.
   */
  router.delete('/', users.deleteUser);

  app.use('/users', router);
};

export default UserRoutes;
