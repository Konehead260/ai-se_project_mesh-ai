import type { Request, Response } from 'express';

export const uploadDocument = (req: Request, res: Response): void => {
  res.status(201).json({
    success: true,
    data: {},
    error: null
  });
};

export const listUserDocuments = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {
      documents: []
    },
    error: null
  });
};

export const fetchDocument = (req: Request, res: Response): void => {
  const { id } = req.params;
  res.status(200).json({
    success: true,
    data: {
      id
    },
    error: null
  });
};

export const deleteDocument = (req: Request, res: Response): void => {
  res.status(204).send();
};
