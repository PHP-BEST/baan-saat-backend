import express from 'express';
import {
  createService,
  updateService,
  deleteService,
} from '../controllers/service';

const serviceRouter = express.Router();

serviceRouter.post('/', createService);

serviceRouter.put('/:id', updateService);

serviceRouter.delete('/:id', deleteService);

export default serviceRouter;
