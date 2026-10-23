import type { Request, Response } from 'express';
import Document from '../models/document.js';
import { chunkText } from '../utils/chunk.js';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';
import Chunk from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';

export const uploadDocument = async (req: Request, res: Response) => {
 if (!req.file) {
   res.status(400).send({
     success: false,
     data: null,
     error: { message: 'File is required' },
   });
   return;
 }

   // Parse the file
  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();
  
  // Chunk the text
  const chunks = chunkText(text);
 

 // Extract the title from the body, or req.file.originalname
 const title = req.body.title || req.file.originalname;

 // Create a Document document. See the models/document.ts
 const document = await Document.create({
   title,
   fileName: req.file.originalname,
   userId: req.user!.userId,
 });

 await Promise.all(
  chunks.map(async (text) => {
    const embedding = await createEmbedding(text);
    return Chunk.create({ documentId: document._id, text, embedding });
  })
);

 res.status(201).send({
   success: true,
   data: document,
   error: null,
 });
};

export const getDocuments = async(req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;

  const documents = await Document.find({ userId });
  res.status(200).json({
    success: true,
    data: {
      documents
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
