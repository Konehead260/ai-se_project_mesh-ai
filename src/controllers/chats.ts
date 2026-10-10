import type { Request, Response } from 'express';

export const listUserChats = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {

    },
    error: null
  });
};

export const createChat = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: {

    },
    error: null
  });
};

export const fetchChat = (req: Request, res: Response): void => {
  const { id } = req.params; 
    res.status(200).json({
    success: true,
    data: {

    },
    error: null
  });
};

export const deleteChat = (req: Request, res: Response): void => {
  const { id } = req.params; 
   res.status(204).send();
};

export const sendMessage = (req: Request, res: Response): void => {
  const { id } = req.params; 
  const { text } = req.body;
   res.status(201).json({
    success: true,
    data: {
     text
    },
    error: null
  });
};