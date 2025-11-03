import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
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

// Methods
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
