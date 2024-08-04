import { Joi } from 'celebrate';

const GET_USER = {
  params: Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const PATCH_USER = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
};

const PATCH_AVATAR = {
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
};

const POST_SIGNIN = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const POST_SIGNUP = {
  body: Joi.object().keys({
    name: Joi.string(),
    about: Joi.string(),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const POST_CARD = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().required(),
  }),
};

const DELETE_CARD = {
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const PUT_CARD_LIKE = {
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

const DELETE_CARD_LIKE = {
  params: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
};

export default {
  GET_USER,
  PATCH_USER,
  PATCH_AVATAR,
  POST_SIGNIN,
  POST_SIGNUP,
  POST_CARD,
  DELETE_CARD,
  PUT_CARD_LIKE,
  DELETE_CARD_LIKE,
};
