import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
   _id: Types.ObjectId; 
  name: string;
  email: string;
  password: string;
  score: number;
  permissions: Map<string, boolean>;
  createdAt: Date;
  updatedAt: Date;

  hasPermission(perm: string): boolean;
  grantPermission(perm: string): void;
  revokePermission(perm: string): void;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
    },
    permissions: {
      type: Map,
      of: Boolean,
      default: new Map<string, boolean>(),
    },
  },
  {
    timestamps: true,
   toJSON: {
    transform: (_doc, ret: any) => {
        delete ret.password;
        delete ret.__v;
        return ret;
    },
    },
  }
);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the user
 *           example: "64a8f789f1e6c2a1b2c56795"
 *         name:
 *           type: string
 *           description: User's full name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           description: User email
 *           example: "john@example.com"
 *         score:
 *           type: integer
 *           description: User's score
 *           example: 0
 *         permissions:
 *           type: object
 *           description: Map of permissions (true if granted)
 *           additionalProperties:
 *             type: boolean
 *           example: 
 *             ADMIN: false
 *             CREATE_QUESTION: true
 *             EDIT_QUESTION: true
 *             DELETE_QUESTION: true
 *             CREATE_COLLECTION: true
 *             EDIT_COLLECTION: true
 *             DELETE_COLLECTION: true
 *             EDIT_USER: true
 *             DELETE_USER: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *           example: "2025-11-10T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2025-11-10T12:35:56.789Z"
 */
userSchema.methods.hasPermission = function (this: IUser, perm: string): boolean {
  return this.permissions.get(perm) === true;
};

userSchema.methods.grantPermission = function (this: IUser, perm: string): void {
  this.permissions.set(perm, true);
  this.markModified('permissions');
};

userSchema.methods.revokePermission = function (this: IUser, perm: string): void {
  this.permissions.delete(perm);
  this.markModified('permissions');
};

userSchema.index({ score: -1 });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
