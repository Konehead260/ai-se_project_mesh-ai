import type { Request, Response } from 'express';
import { getClient, LLM_MODEL, buildContext } from '../utils/openai-client.js';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';



export const sendQuestion = async (req: Request, res: Response) => {
   const { question } = req.body;
 
   if (!question) {
     res.status(400).json({
       success: false,
       data: null,
       error: { message: 'question is required' },
     });
     return;
   }
 
   const userId = req.user!.userId;// TODO - Get the user ID
   const userDocs = await Document.find({ userId }, '_id');// TODO - Find docs for the current user
   const docIds = userDocs.map((d) => d._id);// TODO - Get an array of docs with matching user ID
   // See the callout below for a hint

   const embedding = await createEmbedding(question);
  
   // Filter chunks for the current user's documents
   // TODO - pass the documentId, as shown
   const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
   const chunks = chunkRecords.map((c) => ({
     id: String(c._id),
     documentId: String(c.documentId),
     text: c.text,
     embedding: c.embedding,
   }));
   const topChunks = rankBySimilarity(embedding, chunks);

   const context =  buildContext(topChunks);

   const client = getClient();

   const completion = await client.chat.completions.create({
  model: LLM_MODEL,
  messages: [
    { role: 'system', content: "you're an assistant that answers questions based only on the provided context." },
    { role: 'user', content: `context: ${context}\n\nQuestion: ${question}` },
  ],
});

res.status(200).json({
    success: true,
    data: { question, answer: completion.choices[0]?.message.content },
    error: null,
  });

 
 }