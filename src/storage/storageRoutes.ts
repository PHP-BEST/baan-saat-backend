import { Router, Request, Response } from 'express';
import upload from './storageUpload';

const storageRouter = Router();

storageRouter.post('/', upload.array('file'), (req: Request, res: Response) => {
  // Extract file URLs from uploaded files
  const files = req.files as Express.MulterS3.File[];
  const fileUrlList = files ? files.map((file) => file.location) : [];

  res.status(200).json({
    fileUrlList: fileUrlList,
  });
});

export default storageRouter;
