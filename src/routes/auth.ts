import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createUser, login } from '../controllers/users';
import SCHEMAS from './schemas';

const router = Router();

// @ts-ignore
router.post('/signin', celebrate(SCHEMAS.POST_SIGNIN), login);
router.post('/signup', celebrate(SCHEMAS.POST_SIGNUP), createUser);

export default router;
