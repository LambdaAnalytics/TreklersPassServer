import Joi from 'joi';
import { password, validUserId } from './custom.validation';

export const JoiRole = Joi.array().items({
  id: Joi.string().required(),
  value: Joi.string().required(),
  label: Joi.string().required(),
});

export const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().custom(password),
    name: Joi.string().required(),
    roles: JoiRole,
  }),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    roles: JoiRole,
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(validUserId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(validUserId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};
