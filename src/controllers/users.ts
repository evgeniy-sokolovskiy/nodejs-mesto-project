import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';

const { ValidationError, CastError } = mongoose.Error;

export interface RequestWithUser extends Request {
  user?: {
    _id: string,
  }
}

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(user);
  } catch (error) {
    if (error instanceof CastError) {
      return next(new BadRequestError('Передан некорректный id пользователя'));
    } else {
      return next(error);
    }
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;

    const newUser = await User.create({ name, about, avatar });
    return res.status(constants.HTTP_STATUS_CREATED).send({ data: newUser });
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      return next(error);
    }
  }
};

export const updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(req.user?._id, { name, about }, {
      new: true,
      runValidators: true,
    }).orFail(new NotFoundError('Пользователь с указанным _id не найден.'));
    return res.send(user);
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    } else {
      return next(error);
    }
  }
};

export const updateUserAvatar = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, { $set: { avatar } }, {
      new: true,
      runValidators: true,
    }).orFail(new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(user);
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
    } else {
      return next(error);
    }
  }
};
