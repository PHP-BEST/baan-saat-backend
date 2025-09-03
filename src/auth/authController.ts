import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    next();
  }
  res.status(401).send();
};

export const logout = (req: Request, res: Response) => {
  req.logOut((error) => console.error(error));
  res.status(200).send();
};
