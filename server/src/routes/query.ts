import { Router } from 'express';
import { sendQuestion } from '../controllers/query.js';
import { auth } from '../middleware/auth.js';

const queryRouter = Router();

queryRouter.use(auth);

queryRouter.post('/', sendQuestion)

export { queryRouter };