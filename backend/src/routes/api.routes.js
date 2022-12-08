import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const router = Router();

const options = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'SOP Organizer',
        version: '1.0.0',
      },
    },
    apis: [
            './src/routes/auth.routes.js',
            './src/routes/directory.routes.js',
            './src/routes/document.routes.js',
            './src/routes/sop.routes.js',
            './src/routes/user.routes.js'
          ],
  };

const swaggerSpec = swaggerJsdoc(options);

const ApiRoutes = (app) => {
  router.get('/', swaggerUi.setup(swaggerSpec));
  // router.get('/', users.getAll);
  
  app.use('/api-docs', swaggerUi.serve, router);
  // app.use('/api-docs', router);
};

export default ApiRoutes;