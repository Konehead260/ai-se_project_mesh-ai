import { Router } from 'express';
import {
  deleteDocument,
  fetchDocument,
  listUserDocuments,
  uploadDocument
} from '../controllers/documents.js';

const documentsRouter = Router();

documentsRouter.post('/', uploadDocument);
documentsRouter.get('/', listUserDocuments);
documentsRouter.get('/:id', fetchDocument);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };