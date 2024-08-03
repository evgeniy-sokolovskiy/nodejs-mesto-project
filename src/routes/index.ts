import { Router } from 'express';
import userRouter from './users';
import cardRouter from './cards';
import NotFoundError from '../errors/not-found-error';

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (_req, _res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

export default router;
