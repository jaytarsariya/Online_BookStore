import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const config = require('../config/config.ts')['development'];
const sKEY = config.jwt_secret;

declare global {
  namespace Express {
    interface Request {
      udata?: any;
    }
  }
}

export const auth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const token = request.cookies.token;
    if (!token) {
      return response.status(400).json({ message: 'pls login first !' });
    }
    const decodeToken = jwt.verify(token, sKEY);
    if (!decodeToken) {
      return response.status(400).json({ message: 'invalid token !' });
    }
    request.udata = decodeToken;
    next();
  } catch (error: any) {
    return response.status(400).json({ message: error.message });
  }
};

export const authorizeRole = (...roles: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.udata || !roles.includes(request.udata.role)) {
      return response
        .status(400)
        .json({ message: 'you are not authorized to access this route' });
    }
    next();
  };
};
