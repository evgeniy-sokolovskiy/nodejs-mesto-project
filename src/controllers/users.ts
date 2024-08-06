import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { constants } from 'http2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import { getJwtExpires } from '../helpers/common';
import ConflictError from '../errors/conflict-error';
import ERROR_CODES from '../constants/errors';
import CONFIG from '../config';

const { ValidationError, CastError } = mongoose.Error;

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};

export const getOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).orFail(new NotFoundError('Пользователь с указанным _id не найден'));
    return res.send(user);
  } catch (error) {
    if (error instanceof CastError) {
      return next(new BadRequestError('Передан некорректный id пользователя'));
    } else {
      return next(error);
    }
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
    const {
      name, about, avatar, email, password,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, about, avatar, email, password: passwordHash,
    });
    return res.status(constants.HTTP_STATUS_CREATED).send({ data: newUser });
  } catch (error) {
    // @ts-ignore
    if (error.code === ERROR_CODES.CONFLICT) {
      return next(new ConflictError('Пользователь с таким email существует'));
    }
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      return next(error);
    }
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, { name, about }, {
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

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      CONFIG.JWT_TOKEN,
      { expiresIn: String(getJwtExpires(7)) },
    );
    return res.cookie('jwt', token, {
      maxAge: getJwtExpires(7),
      httpOnly: true,
    }).send({ token });
  } catch (error) {
    return next(error);
  }
};
