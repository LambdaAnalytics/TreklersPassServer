const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().optional().custom(password),
    mobileNumber: Joi.string().required(),
    experience: Joi.string().optional(),
    driverType: Joi.any().optional(),
    address: Joi.object().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    zipCode: Joi.string().optional(),
    driverExp: Joi.string().optional(),
    minExp: Joi.number().optional(),
    maxExp: Joi.number().optional(),
    privacyPolicy: Joi.boolean().optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const otp = {
  query: Joi.object().keys({
    // token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  otp,
};
