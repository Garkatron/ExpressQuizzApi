import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  options: string[];
  answer: string;
  owner?: mongoose.Types.ObjectId; 
  tags: string[];
}

const questionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length >= 2,
        message: 'Debe haber al menos 2 opciones',
      },
    },
    answer: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, 
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - question
 *         - options
 *         - answer
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the question
 *           example: "64a8f456f1e6c2a1b2c56794"
 *         question:
 *           type: string
 *           description: Question text
 *           example: "What is the capital of France?"
 *         options:
 *           type: array
 *           description: Array of possible answers
 *           items:
 *             type: string
 *           example: ["Paris", "London", "Berlin"]
 *         answer:
 *           type: string
 *           description: Correct answer
 *           example: "Paris"
 *         owner:
 *           type: string
 *           description: User ID of the question owner (optional)
 *           example: "64a8c123f1e6c2a1b2c56789"
 *         tags:
 *           type: array
 *           description: Tags associated with the question
 *           items:
 *             type: string
 *           example: ["geography", "europe"]
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
const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;