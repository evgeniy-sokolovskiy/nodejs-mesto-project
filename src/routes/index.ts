import { Router } from 'express';
import { celebrate } from 'celebrate';
import userRouter from './users';
import cardRouter from './cards';
import NotFoundError from '../errors/not-found-error';
import authMiddleware from '../middlewares/auth';
import SCHEMAS from './schemas';
import { createUser, login } from '../controllers/users';

const router = Router();
router.post('/signin', celebrate(SCHEMAS.POST_SIGNIN), login);
router.post('/signup', celebrate(SCHEMAS.POST_SIGNUP), createUser);

router.use(authMiddleware);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (_req, _res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

export default router;
