<<<<<<< HEAD
import authJwt from '../middleware/auth.Jwt.js';
import controller from '../controllers/user.controller.js';
=======
import users from '../controllers/user.controller.js';
>>>>>>> b1cec3319a72de3f10aa30c241b06984ab85fc9a
import { Router } from 'express';

const router = Router();

const UserRoutes = (app) => {
<<<<<<< HEAD
  /*app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, Content-Type, Accept"
        );
        next();
      });*/

  router.get('/all', controller.allAccess);

  router.get('/user', [authJwt.verifyToken], controller.userBoard);

  router.get(
    '/admin',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.use('', router);
=======
  router.get('/', users.getAll);
  router.get('/:id', users.getById);
  router.post('/', users.create);
  router.patch('/:id', users.update);

  app.use('/users', router);
>>>>>>> b1cec3319a72de3f10aa30c241b06984ab85fc9a
};

export default UserRoutes;
