import { Request } from 'express';
import { IUser } from '../models/User.ts';

export interface AuthenticatedRequest<
  Params = Record<string, any>,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<Params, ResBody, ReqBody, ReqQuery> {
  user?: IUser;
}