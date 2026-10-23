import { Schema, model } from 'mongoose';

const chunkSchema = new Schema({
  documentId: { type: Schema.Types.ObjectId, required: true, ref: 'Document' },
  text: { type: String, required: true },
  embedding: { type:[Number], default:[] },
  createdAt: {
  type: Date,
  default: Date.now,
},
});

export default model('Chunk', chunkSchema);