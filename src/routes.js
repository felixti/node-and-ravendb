import { Router } from 'express';
import TestController from './controllers/TestController';

const routes = Router();

routes.use((req, res, next) => {
  console.log('Receiving a request');
  next();
});

routes.get('/', TestController.index.bind(TestController));

routes.get('/:name', TestController.indexWithName.bind(TestController));

export default routes;
