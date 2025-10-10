import { Application } from 'express';
import authRoutes from './auth/authRoutes';
import userRoutes from './user/userRoutes';
import postRoutes from './post/postRoutes';
import applyRoutes from './apply/applyRoutes';
import offerRoutes from './offer/offerRoutes';
import hireRouter from './Hire/hireRoutes';

const useRoutes = (app: Application) => {
  app.use('/', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/applys', applyRoutes);
  app.use('/api/offers', offerRoutes);
  app.use('/api/hire',hireRouter );
};

export default useRoutes;
