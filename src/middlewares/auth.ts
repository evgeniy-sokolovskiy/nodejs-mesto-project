import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import { IUser } from '../models/user';
import CONFIG from '../config';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, CONFIG.JWT_TOKEN);
  } catch (err) {
    return res
      .status(constants.HTTP_STATUS_UNAUTHORIZED)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload as IUser;
  return next();
};

export default authMiddleware;
