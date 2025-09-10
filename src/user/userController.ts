import { Request, Response } from 'express';

export const getUserSession = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as any;
    res.json({
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });
  } else {
    res.send();
  }
};
