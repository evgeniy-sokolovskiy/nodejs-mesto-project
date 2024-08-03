import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import mongoose from 'mongoose';
import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';
import { RequestWithUser } from './users';
import NotFoundError from '../errors/not-found-error';

const { ValidationError, CastError } = mongoose.Error;

export const getCards = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
  }
};
export const createCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.user?._id;

    const newCard = await Card.create({ name, link, owner });
    return res.status(constants.HTTP_STATUS_CREATED).send(newCard);
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
    } else {
      return next(error);
    }
  }
};

export const deleteCard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId).orFail(new NotFoundError('Карточка с указанным _id не найдена'));
    return res.send(card);
  } catch (error) {
    if (error instanceof CastError) {
      return next(new BadRequestError('Передан некорректный id карточки'));
    } else {
      return next(error);
    }
  }
};

export const addLike = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const owner = req.user?._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: owner } },
      { new: true },
    ).orFail(new NotFoundError('Передан несуществующий _id карточки'));
    return res.send(card);
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
    } else {
      return next(error);
    }
  }
};

export const deleteLike = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const owner = req.user?._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: owner } },
      { new: true },
    ).orFail(new NotFoundError('Передан несуществующий _id карточки'));
    return res.send(card);
  } catch (error) {
    if (error instanceof ValidationError) {
      return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
    } else {
      return next(error);
    }
  }
};
