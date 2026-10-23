import { Router } from 'express';
import {
  deleteDocument,
  fetchDocument,
  getDocuments,
  uploadDocument
} from '../controllers/documents.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';

const documentsRouter = Router();

documentsRouter.use(auth);

const upload = multer({ dest: 'uploads/' });

 documentsRouter.post('/', upload.single('file'), uploadDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', fetchDocument);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };