import { Router } from 'express';
import { authUser, getCurrentUser, registerUser } from '../controllers/auth.js';

const authRouter = Router();

authRouter.get('/me', getCurrentUser);
authRouter.post('/register', registerUser);
authRouter.post('/login', authUser)

export { authRouter };