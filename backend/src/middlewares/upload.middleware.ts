import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const localStorage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, callback) {
    const uploadFolder = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    callback(null, uploadFolder);
  },
  filename: function (_req, file, cb) {
    crypto.pseudoRandomBytes(16, function (_err, raw) {
      cb(
        null,
        raw.toString('hex') +
          Date.now() +
          '.' +
          file.originalname.split('.')[file.originalname.split('.').length - 1],
      );
    });
  },
});

const uploadMiddleware = multer({
  storage: localStorage,
  fileFilter: function (
    _req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback,
  ) {
    const ext = path.extname(file.originalname);
    if (ext !== '.csv') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
});

export default uploadMiddleware;
