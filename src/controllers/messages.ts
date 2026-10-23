import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import Chat from '../models/chat.js';
import Chunk from '../models/chunk.js';
import Document from '../models/document.js';
import Message from '../models/message.js';
import { createEmbedding } from '../utils/embeddings.js';
import { buildContext, getClient, LLM_MODEL } from '../utils/openai-client.js';
import { rankBySimilarity } from '../utils/vector-search.js';


export const createMessage = async (req: Request, res: Response): Promise<void> => {
  const { question } = req.body;
  const chatId = req.params.id;
  const userId = req.user!.userId;

  if (typeof question !== 'string' || !question.trim()) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'question is required' },
    });
    return;
  }

  const chat = typeof chatId === 'string' && Types.ObjectId.isValid(chatId)
    ? await Chat.findOne({ _id: chatId, userId })
    : null;

  if (!chat) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Chat not found' },
    });
    return;
  }

  const userDocs = await Document.find({ userId }, '_id');
  const docIds = userDocs.map((d) => d._id);
  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));
  const queryEmbedding = await createEmbedding(question);
  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
  const context = buildContext(ranked);

  const completion = await getClient().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: 'system',
        content: "you're an assistant that answers questions based only on the provided context.",
      },
      { role: 'user', content: `context: ${context}\n\nQuestion: ${question}` },
    ],
  });
  const answer = completion.choices[0]?.message.content;

  if (typeof answer !== 'string') {
    throw new Error('The language model did not return an answer');
  }

  const messages = await Message.create([
    { chatId: chat._id, role: 'user', content: question },
    { chatId: chat._id, role: 'assistant', content: answer },
  ]);

  res.status(201).json({
    success: true,
    data: messages,
    error: null,
  });
};