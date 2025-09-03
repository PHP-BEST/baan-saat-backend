import { Application } from "express";
import authRoutes from "./auth/authRoutes";

const useRoutes = (
    app: Application
) => {
    app.use('/', authRoutes)
};

export default useRoutes;