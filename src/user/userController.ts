import { Request, Response } from 'express';

export const getUserSession = async (req: Request, res: Response) => {
  if (req.user) {
    res.json(req.user as any);
  } else {
    res.send();
  }
};
