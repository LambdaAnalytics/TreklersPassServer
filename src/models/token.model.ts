const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { TOKEN_TYPES } = require('../config/tokens');

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [TOKEN_TYPES.REFRESH, TOKEN_TYPES.RESET_PASSWORD, TOKEN_TYPES.VERIFY_EMAIL, TOKEN_TYPES.LOGIN_OTP],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
export const Token = mongoose.model('Token', tokenSchema);
