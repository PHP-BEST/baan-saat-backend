import { Application } from 'express';
import authRoutes from './auth/authRoutes';
import userRoutes from './user/userRoutes';
import postRoutes from './post/postRoutes';
import applyRoutes from './apply/applyRoutes';
import paymentRouter from './payment/paymentRoutes';
import storageRouter from './storage/storageRoutes';

const useRoutes = (app: Application) => {
  app.use('/', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/applys', applyRoutes);
  app.use('/api/payments', paymentRouter);

  app.use('/api/storage', storageRouter);
};

export default useRoutes;
