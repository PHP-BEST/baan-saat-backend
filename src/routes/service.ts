import express from 'express';
import {
  createService,
  getServices,
  getServiceById,
  searchServicesByTitle,
  searchServicesByBudget,
  searchServicesByTags,
  searchServicesByDate,
  updateService,
  deleteService,
} from '../controllers/service';

const serviceRouter = express.Router();

serviceRouter.post('/', createService);

serviceRouter.get('/', getServices);

serviceRouter.get('/:id', getServiceById);

serviceRouter.get('/search', searchServicesByTitle);

serviceRouter.get('/search', searchServicesByBudget);

serviceRouter.get('/search', searchServicesByTags);

serviceRouter.get('/search', searchServicesByDate);

serviceRouter.put('/:id', updateService);

serviceRouter.delete('/:id', deleteService);

export default serviceRouter;
