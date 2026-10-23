import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import express from 'express';
import indexRouter from './routes/index.js';
import { logger } from './middleware/logger.js'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

const app = express();

app.use(express.json());
app.use(logger);
app.use(indexRouter);

app.get("/health", (req, res): void => {
  res.status(200).json({
    "success": true,
    "data": { "status": "ok" },
    "error": null
  });
});

app.get('/test-error', (req, res) => {
  throw new Error('Test error');
});

app.use(notFoundHandler);

app.use(errorHandler);

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error('Connection error', err);
  });