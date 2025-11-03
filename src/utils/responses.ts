import { Response } from "express";

function send_response(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string = '',
  data: unknown = null
): Response {
  const responseBody: { success: boolean; message: string; data?: unknown } = { success, message };

  if (data !== null) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody);
}

export function send_response_successful(res: Response, message: string, data?: unknown): Response {
  return send_response(res, 200, true, message, data);
}

export function send_response_created(res: Response, message: string, data?: unknown): Response {
  return send_response(res, 201, true, message, data);
}

export function send_response_unsuccessful(res: Response, errors: string[] = []): Response {
  return send_response(res, 400, false, errors.join(', '));
}

export function send_response_unauthorized(res: Response, errors: string[] = []): Response {
  return send_response(res, 401, false, errors.join(', '));
}

export function send_response_not_found(res: Response, errors: string[] = []): Response {
  return send_response(res, 404, false, errors.join(', '));
}

export function send_response_server_error(res: Response, errors: string[] = []): Response {
  return send_response(res, 500, false, errors.join(', '));
}
