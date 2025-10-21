import { Router, Request, Response } from 'express';
import upload from './storageUpload';
import { deleteFile } from './storageUpload';

const storageRouter = Router();

// Upload multiple files
storageRouter.post('/', upload.array('file'), (req: Request, res: Response) => {
  // Extract file URLs from uploaded files
  const files = req.files as Express.MulterS3.File[];
  const fileKeyList = files ? files.map((file) => file.key) : [];

  res.status(200).json({
    fileKeyList: fileKeyList,
  });
});

// Delete single file
storageRouter.delete('/', async (req: Request, res: Response) => {
  try {
    const key = req.body.key;
    await deleteFile(key);

    res.status(200).json({
      message: 'File deleted successfully',
      deletedKey: key,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to delete file',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default storageRouter;
