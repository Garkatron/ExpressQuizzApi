import { Types } from 'mongoose';
import { ERROR_MESSAGES, UserPermissions } from '../constants.js';

export function has_ownership_or_admin(
  user: { permissions: Map<UserPermissions, boolean>; _id: Types.ObjectId },
  resourceOwnerId: Types.ObjectId | string
): void {
  const isAdmin = user.permissions.get(UserPermissions.ADMIN) === true;
  const isOwner = user._id.equals(resourceOwnerId);

  if (!(isAdmin || isOwner)) {
    throw new Error(ERROR_MESSAGES.NEED_OWNERSHIP_OR_ADMIN);
  }
}