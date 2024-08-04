import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  addLike, createCard, deleteCard, deleteLike, getCards,
} from '../controllers/cards';
import SCHEMAS from './schemas';

const router = Router();

router.get('/', getCards);
router.post('/', celebrate(SCHEMAS.POST_CARD), createCard);
router.delete('/:cardId', celebrate(SCHEMAS.DELETE_CARD), deleteCard);
router.put('/:cardId/likes', celebrate(SCHEMAS.PUT_CARD_LIKE), addLike);
router.delete('/:cardId/likes', celebrate(SCHEMAS.DELETE_CARD_LIKE), deleteLike);

export default router;
