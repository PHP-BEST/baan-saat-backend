import { Application } from "express";
import authRoutes from "./auth/authRoutes";
import userRoutes from "./user/userRoutes";

const useRoutes = (
    app: Application
) => {
    app.use('/', authRoutes)
    app.use('/api', userRoutes)
};

export default useRoutes;