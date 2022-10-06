import auth from '../controllers/auth.controller.js';
import { Router } from 'express';
import bodyParser from 'body-parser';
import jwt from '../middleware/auth.Jwt.js';

const router = Router();

const AuthRoutes = (app) => {
  var jsonParser = bodyParser.json();

  router.post('/signin', jsonParser, auth.signin);

  router.post('/signout', auth.signout);

  router.post('/register', jsonParser, auth.register);

  app.use('/auth', router);
};
export default AuthRoutes;
