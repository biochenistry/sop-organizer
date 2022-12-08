import auth from '../controllers/auth.controller.js';
import { Router } from 'express';
import jwt from '../middleware/auth.Jwt.js';

const router = Router();

const AuthRoutes = (app) => {
  /**
   * @swagger
   * /auth/signin:
   *   post:
   *     summary: Signs in a user
   *     tags: 
   *       - auth
   *     parameters:
   *      - in: formData
   *        name: Email
   *        schema:
   *          type: string
   *        required: true
   *        description: Email of user to sign in
   *      - in: formData
   *        name: Password
   *        schema:
   *          type: string
   *        required: true
   *        description: Password of user to sign in
   *     responses:
   *       200:
   *         description: Returns a user object.
   */
  router.post('/signin', auth.signin);

  /**
   * @swagger
   * /auth/signout:
   *   post:
   *     summary: Signs a user out
   *     tags: 
   *       - auth
   *     responses:
   *       200:
   *         description: Returns 'You\'ve been signed out!'.
   */
  router.post('/signout', auth.signout);

  /**
   * @swagger
   * /auth/preregister:
   *   post:
   *     summary: Pre-registers a user
   *     tags: 
   *       - auth
   *     parameters:
   *      - in: formData
   *        name: email
   *        schema:
   *          type: string
   *        required: true
   *        description: Email of user to pre-register
   *     responses:
   *       200:
   *         description: Returns 'record inserted'.
   *       409:
   *         description: Returns 'User already registered'.
   */
  router.post('/preregister', auth.preregister);

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Registers a user
   *     tags: 
   *       - auth
   *     parameters:
   *      - in: formData
   *        name: Name
   *        schema:
   *          type: string
   *        required: true
   *        description: Name of user to register
   *      - in: formData
   *        name: Email
   *        schema:
   *          type: string
   *        required: true
   *        description: Email of user to register
   *      - in: formData
   *        name: Password
   *        schema:
   *          type: string
   *        required: true
   *        description: Password of user to register
   *     responses:
   *       200:
   *         description: Returns 'record inserted'.
   *       403:
   *         description: Returns 'User already registered.'.
   *       409:
   *         description: Returns 'User not pre-registered by admin.'.
   */
  router.post('/register', auth.register);

  /**
   * @swagger
   * /auth/perms:
   *   post:
   *     summary: Updates the permission of a user 
   *     tags: 
   *       - auth
   *     parameters:
   *      - in: Email
   *        type: string
   *     responses:
   *       200:
   *         description: Returns 'user privilege updated.'.
   *       409:
   *         description: Returns 'User does not exist with that email.'
   */
  router.post('/perms', jwt.verifyToken, jwt.isAdmin, auth.changePermission);

  /**
   * @swagger
   * /auth/removeFile:
   *   delete:
   *     summary: Deletes a file
   *     tags: 
   *       - auth
   *     parameters:
   *      - in: formData
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of file to delete
   *     responses:
   *       200:
   *         description: Returns 'Deleted Row(s)'.
   *       500:
   *         description: Returns an error.
   */
  router.delete('/removefile', jwt.verifyToken, jwt.isAdmin, auth.removeFile);

  app.use('/auth', router);
};
export default AuthRoutes;
