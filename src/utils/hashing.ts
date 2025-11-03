import jwt from 'jsonwebtoken';
import { CONFIG } from '#constants';
import * as bcrypt from 'bcryptjs';

class PasswordHashError extends Error {
  constructor() {
    super("Can't hash the password");
    this.name = 'PasswordHashError';
  }
}

class PasswordSaltError extends Error {
  constructor() {
    super("Can't generate salt");
    this.name = 'PasswordSaltError';
  }
}

class PasswordCompareError extends Error {
  constructor() {
    super("Can't compare password");
    this.name = 'PasswordCompareError';
  }
}

export async function hash_password(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(CONFIG.PASSWORD_SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err: any) {
    if (err.message.includes('salt')) {
      throw new PasswordSaltError();
    }
    throw new PasswordHashError();
  }
}

export async function compare_password(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    throw new PasswordCompareError();
  }
}

export function generate_access_token(user_name: string, user_permissions: Map<string, boolean>): string {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not definied');
  return jwt.sign(
    {
      name: user_name,
      permissions: user_permissions,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}