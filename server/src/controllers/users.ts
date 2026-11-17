import type { Request, Response } from 'express';
import User from '../models/user.js';

export const getCurrentUser = async (
 req: Request,
 res: Response,
): Promise<void> => {
 // Get the ID from the req.user object
 const userId = req.user!.userId;
 // Find the user by its ID and omit the password with .select("-password")
 const user = await User.findById(userId).select('-password');
 // If the user isn't found, return a 404 with an appropriate message
  if (!user) {
     res.status(404).json({
       success: false,
       data: null,
       error: { message: 'User not found.' },
     });
     return;
   }
 // Otherwise, return a 200 response with the user's info (but not the password)
res.status(200).json({
    success: true,
    data: { email: user.email, name: user.name, userId},
    error: null,
  });

};