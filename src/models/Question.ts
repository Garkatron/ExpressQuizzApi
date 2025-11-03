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

const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;