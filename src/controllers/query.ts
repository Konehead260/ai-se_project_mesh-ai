import type { Request, Response } from 'express';


export const sendQuestion = (req: Request, res: Response): void => { 
  const { text } = req.body;
   res.status(200).json({
    success: true,
    data: {
     text
    },
    error: null
  });
};