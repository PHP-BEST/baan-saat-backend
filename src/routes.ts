import { Application } from 'express';
import authRoutes from './auth/authRoutes';
import userRoutes from './user/userRoutes';
import sampleRoutes from './sample/sampleRoutes';
import serviceRoutes from './service/serviceRoutes';
import offerRoutes from './offer/offerRoutes';

const useRoutes = (app: Application) => {
  app.use('/', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/samples', sampleRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/offers', offerRoutes);
};

export default useRoutes;
