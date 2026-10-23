import { Router } from 'express';
import { getCurrentUser, register, login } from '../controllers/auth.js';

const authRouter = Router();

authRouter.get('/me', getCurrentUser);
authRouter.post('/register', register);
authRouter.post('/login', login);

export { authRouter };