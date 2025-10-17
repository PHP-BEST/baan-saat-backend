import { S3 } from '@aws-sdk/client-s3';
import { spaceKey, spaceSecret } from '../configs';

import multer from 'multer';
import multerS3 from 'multer-s3';

const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: 'https://sgp1.digitaloceanspaces.com',
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: spaceKey,
    secretAccessKey: spaceSecret,
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const validFileType = ['image/jpeg', 'image/png', 'video/mp4'];
  if (validFileType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const storage = multerS3({
  s3: s3Client,
  bucket: 'baan-saat',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    const prefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `files/${prefix}-${file.originalname}`);
  },
});

export default multer({ storage, fileFilter });
