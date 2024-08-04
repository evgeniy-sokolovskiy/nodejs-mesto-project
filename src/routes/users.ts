import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getOwner, getUserById, getUsers, updateUser, updateUserAvatar,
} from '../controllers/users';
import SCHEMAS from './schemas';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', celebrate(SCHEMAS.GET_USER), getUserById);
router.get('/me', getOwner);
router.patch('/me', celebrate(SCHEMAS.PATCH_USER), updateUser);
router.patch('/me/avatar', celebrate(SCHEMAS.PATCH_AVATAR), updateUserAvatar);

export default router;
