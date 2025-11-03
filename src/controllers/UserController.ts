import { ERROR_MESSAGES, UserPermissions } from "../constants.js";
import User, { IUser } from "../models/User.js";
import { has_valid_email, has_valid_name, has_valid_password } from "../utils/format.js";
import { Request, Response } from 'express';
import { send_response_created, send_response_successful, send_response_unsuccessful } from "../utils/responses.js";
import { compare_password, generate_access_token, hash_password } from "../utils/hashing.js";
import { has_ownership_or_admin } from "../utils/utils.js";
import { AuthenticatedRequest } from "../interfaces/express.js";

interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
}

interface LoginUserBody {
  name: string;
  password: string;
}

interface EditUserBody {
  newName?: string;
  newEmail?: string;
  newPassword?: string;
}

interface GetUsersQuery extends qs.ParsedQs {
  name?: string;
  id?: string;
  email?: string;
  page?: string;
  limit?: string;
}

// === Helper: user_exists ===
export const user_exists = async (criteria: { name?: string; id?: string; email?: string }): Promise<IUser> => {
  const { name, id, email } = criteria;

  let query: any = {};
  if (id) query._id = id;
  else if (email) query.email = email;
  else if (name) query.name = name;
  else throw new Error('Debe proporcionar name, id o email.');

  const user = await User.findOne(query);
  if (!user) throw new Error(ERROR_MESSAGES.NOT_FOUND_USER);

  return user;
};

export const does_user_exist = async (name: string): Promise<boolean> => {
  const user = await User.findOne({ name });
  return !!user;
};

export const email_not_used = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (user) throw new Error(ERROR_MESSAGES.EMAIL_TAKEN);
};

export const is_email_used = async (email: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  return !!user;
};


export const registerUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    has_valid_name(name);
    has_valid_email(email);
    has_valid_password(password);

    // Verificar si el usuario ya existe
    const existingByName = await User.findOne({ name });
    if (existingByName) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.USER_EXISTS]);
      return;
    }

    await email_not_used(email);

    const hashedPassword = await hash_password(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      score: 0,
      permissions: {
        [UserPermissions.ADMIN]: false,
        [UserPermissions.EDIT_QUESTION]: true,
        [UserPermissions.DELETE_QUESTION]: true,
        [UserPermissions.CREATE_QUESTION]: true,
        [UserPermissions.CREATE_COLLECTION]: true,
        [UserPermissions.EDIT_COLLECTION]: true,
        [UserPermissions.DELETE_COLLECTION]: true,
        [UserPermissions.EDIT_USER]: true,
        [UserPermissions.DELETE_USER]: true,
        [UserPermissions.CREATE_USER]: true,
      },
    });

    await newUser.save();

    send_response_created(res, 'User created successfully', {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const loginUser = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response
): Promise<void> => {
  try {
    const { name, password } = req.body;

    const user = await user_exists({ name });

    const isMatch = await compare_password(password, user.password);
    if (!isMatch) {
      send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_PASSWORD]);
      return;
    }

    const accessToken = generate_access_token(name, user.permissions);

    send_response_successful(res, 'Login successful', {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        permissions: user.permissions,
      },
      accessToken,
    });
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const currentUser = await user_exists({ name: req.user?.name });
    const userToDelete = await user_exists({ id });

    has_ownership_or_admin({"permissions": currentUser.permissions, "_id": currentUser._id}, userToDelete._id);

    await userToDelete.deleteOne();

    send_response_successful(res, 'User deleted successfully', { _id: userToDelete._id });
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const editUser = async (
  req: Request<{ id: string }, {}, EditUserBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { newName, newEmail, newPassword } = req.body;

    const userToUpdate = await user_exists({ id });
    const editor = await user_exists({ name: req.user?.name });

    has_ownership_or_admin(editor, userToUpdate._id);

    const updates: Partial<IUser> = {};

    if (newName !== undefined) {
      has_valid_name(newName);
      const existing = await User.findOne({ name: newName, _id: { $ne: id } });
      if (existing) throw new Error(ERROR_MESSAGES.USER_EXISTS);
      updates.name = newName.trim();
    }

    if (newEmail !== undefined) {
      has_valid_email(newEmail);
      await email_not_used(newEmail);
      updates.email = newEmail.trim().toLowerCase();
    }

    if (newPassword !== undefined) {
      has_valid_password(newPassword);
      updates.password = await hash_password(newPassword);
    }

    if (Object.keys(updates).length > 0) {
      await userToUpdate.updateOne(updates);
      Object.assign(userToUpdate, updates);
    }

    send_response_successful(res, 'User edited successfully', {
      _id: userToUpdate._id,
      name: userToUpdate.name,
      email: userToUpdate.email,
    });
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};

export const getUsers = async (
  req: Request<{}, {}, {}, GetUsersQuery>,
  res: Response
): Promise<void> => {
  try {
    const { name, id, email, page = '1', limit = '20' } = req.query;
    const pageInt = parseInt(page as string, 10) || 1;
    const limitInt = parseInt(limit as string, 10) || 20;

    const query: any = {};
    if (id) query._id = id;
    if (name) query.name = { $regex: sanitize(name as string), $options: 'i' };
    if (email) query.email = { $regex: sanitize(email as string), $options: 'i' };

    const users = await User.find(query)
      .select('name email permissions score createdAt')
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt)
      .sort({ createdAt: -1 });

    send_response_successful(res, 'Users retrieved', users);
  } catch (error) {
    send_response_unsuccessful(res, [(error as Error).message]);
  }
};