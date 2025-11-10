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

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizzCollection:
 *       type: object
 *       required:
 *         - name
 *         - questions
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the collection
 *           example: "64a8f123f1e6c2a1b2c56793"
 *         name:
 *           type: string
 *           description: Name of the collection
 *           example: "General Knowledge"
 *         tags:
 *           type: array
 *           description: Tags associated with the collection
 *           items:
 *             type: string
 *           example: ["history", "science"]
 *         owner:
 *           type: string
 *           description: User ID of the owner (optional)
 *           example: "64a8c123f1e6c2a1b2c56789"
 *         questions:
 *           type: array
 *           description: Array of Question IDs in the collection
 *           items:
 *             type: string
 *           example: ["64a8d456f1e6c2a1b2c56790", "64a8d789f1e6c2a1b2c56791"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2025-11-10T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2025-11-10T12:35:56.789Z"
 */
const QuizzCollection: Model<IQuizzCollection> = mongoose.model<IQuizzCollection>(
  'QuizzCollection',
  quizzCollectionSchema
);

export default QuizzCollection;