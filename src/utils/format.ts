import { ERROR_MESSAGES, REGEX } from "#constants";

export function is_valid_string(str: unknown): str is string {
  return typeof str === 'string' && str.trim().length > 0;
}

export function has_valid_name(name: unknown): asserts name is string {
  if (!is_valid_string(name)) throw new Error(ERROR_MESSAGES.INVALID_NAME);
}

export function has_valid_password(password: unknown): asserts password is string {
  if (!is_valid_string(password) || !REGEX.PASSWORD_SIMPLE.test(password)) {
    throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
  }
}

export function has_valid_email(email: unknown): asserts email is string {
  if (!is_valid_string(email) || !REGEX.EMAIL.test(email)) {
    throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
  }
}