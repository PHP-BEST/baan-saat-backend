import { Application } from 'express';
import authRoutes from './auth/authRoutes';
import userRoutes from './user/userRoutes';
import sampleRoutes from './sample/sampleRoutes';

const useRoutes = (app: Application) => {
  app.use('/', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/samples', sampleRoutes);
};

export default useRoutes;
