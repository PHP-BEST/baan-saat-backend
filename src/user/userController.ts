import { Request, Response } from 'express';

export const getUserSession = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as any;
    console.log(user);
    res.json({
      username: user.name,
      avatarUrl: user.avatarUrl,
    });
  } else {
    res.send();
  }
};
