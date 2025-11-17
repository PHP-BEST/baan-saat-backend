import { Router, Request, Response } from 'express';
import upload, { deleteFile } from './storageUpload';

const storageRouter = Router();

// ✅ Upload multiple files
storageRouter.post('/', upload.array('file'), (req: Request, res: Response) => {
  const files = req.files as Express.MulterS3.File[];

  const fileKeyList = files.map((file) => file.key);
  const fileUrlList = files.map((file) => file.location); // full public URL

  res.status(200).json({
    fileKeyList,
    fileUrlList, // ✅ add this
  });
});

// ✅ Delete single file
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
