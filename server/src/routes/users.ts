// Import Router
import { Router } from "express";
// Import getCurrentUser
import { getCurrentUser } from "../controllers/users.js"
// Import the auth middleware
import { auth } from "../middleware/auth.js";

const usersRouter = Router();
usersRouter.use(auth);

// Add a GET /me route with getCurrentUser as handler
usersRouter.get('/me', getCurrentUser)

export { usersRouter };