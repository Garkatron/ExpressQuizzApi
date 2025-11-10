import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

const tagsSchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the category
 *           example: "64a8d123f1e6c2a1b2c56791"
 *         name:
 *           type: string
 *           description: Name of the category
 *           example: "Geography"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *           example: "2025-11-10T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2025-11-10T12:34:56.789Z"
 */
const Category: Model<ICategory> = mongoose.model<ICategory>('Category', tagsSchema);

export default Category;