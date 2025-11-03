import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IQuizzCollection extends Document {
  name: string;
  tags: string[];
  owner?: Types.ObjectId;
  questions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const quizzCollectionSchema = new Schema<IQuizzCollection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // opcional
    },
    questions: {
      type: [Schema.Types.ObjectId],
      ref: 'Question',
      default: [],
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticamente
  }
);

// Índices para mejorar rendimiento
quizzCollectionSchema.index({ owner: 1 });
quizzCollectionSchema.index({ tags: 1 });

// Modelo
const QuizzCollection: Model<IQuizzCollection> = mongoose.model<IQuizzCollection>(
  'QuizzCollection',
  quizzCollectionSchema
);

export default QuizzCollection;