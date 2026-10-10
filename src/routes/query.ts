import { Router } from 'express';
import { sendQuestion } from '../controllers/query.js';

const queryRouter = Router();

queryRouter.post('/', sendQuestion)

export { queryRouter };