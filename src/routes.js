import { Router } from 'express';
import TestController from './controllers/TestController';

const routes = Router();

routes.use((req, res, next) => {
  console.log('Receiving a request');
  next();
});

routes.get('/products', TestController.index.bind(TestController));

routes.get('/products/:id', TestController.indexWithName.bind(TestController));

routes.post('/products', TestController.create.bind(TestController));

export default routes;
