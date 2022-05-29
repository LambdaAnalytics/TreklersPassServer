import jwt from 'jsonwebtoken';
import moment from 'moment';
import httpStatus from 'http-status';
import config from '../config/config';
import { Token } from '../models';
import ApiError from '../utils/ApiError';
import { TOKEN_TYPES } from '../config/tokens';
import { OTPUtil } from '../utils/otpUtil';

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @returns {Object}
 */
export const extractJwtPlayload = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Generate token
 * @param {Object} user
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (user, expires, type, data = {}) => {
  const payload = {
    userId: user.id,
    roles: user.roles,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    ...data,
  };
  return jwt.sign(payload, config.jwt.secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
export const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  await Token.update(
    {
      userId,
      type,
    },
    {
      token,
      userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
  return {
    token,
    userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  };
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token, type) => {
  const payload = extractJwtPlayload(token);
  const tokenDoc = await Token.findOne({ token, type, userId: payload.userId });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  if (Date.now() <= tokenDoc.expires) {
    return tokenDoc;
  }
  throw new Error('Token Expired');
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
export const generateAuthTokens = async (user, tokens = [TOKEN_TYPES.ACCESS, TOKEN_TYPES.REFRESH]) => {
  const generatedTokens = {};
  if (tokens.includes(TOKEN_TYPES.ACCESS)) {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    //  generatedTokens.access = generateToken(user, accessTokenExpires, TOKEN_TYPES.ACCESS);
  }
  if (tokens.includes(TOKEN_TYPES.REFRESH)) {
    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    // generatedTokens.authToken = generateToken(user, refreshTokenExpires, TOKEN_TYPES.REFRESH);
    // await saveToken(generatedTokens.authToken, user.id, refreshTokenExpires, TOKEN_TYPES.REFRESH);
  }
  return generatedTokens;
};

/**
 * Generate reset password token
 * @param {User} user
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (user) => {
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user, expires, TOKEN_TYPES.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, TOKEN_TYPES.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user, expires, TOKEN_TYPES.VERIFY_EMAIL, {
    email: user.email,
  });
  await saveToken(verifyEmailToken, user.id, expires, TOKEN_TYPES.VERIFY_EMAIL);
  return verifyEmailToken;
};

/**
 * Generate verify email token
 * @param {string} str
 * @param {string} headerKey
 * @returns {string}
 */
export const extractJwtTokenFromString = (str) => {
  const jwtPartRegex = '[A-Za-z0-9-_.+/=]';
  const jwtRegex = new RegExp(`(${jwtPartRegex}+\\.${jwtPartRegex}+\\.${jwtPartRegex}+)`, 'i');
  const jwMatch = new String(str).match(jwtRegex);
  return jwMatch && jwMatch[1] ? jwMatch[1] : '';
};

function generateRandomOTP(NoOfOTPDigits = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < NoOfOTPDigits; i += 1) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Send verification email
 * @param {string} mobileNumber
 * @returns {Promise}
 */

export async function generateOTP(mobileNumber: any) {
  if (mobileNumber.length !== 10) throw Error('Invalid mobile number');
  const expireTime = moment().add(5, 'minutes');
  const tokenDoc = await Token.findOne({
    type: TOKEN_TYPES.LOGIN_OTP,
    userId: mobileNumber,
  });
  let otp;
  if (tokenDoc && tokenDoc.token && tokenDoc.expires > Date.now()) {
    otp = tokenDoc.token;
  } else {
    otp = generateRandomOTP();
  }
  await Promise.all([
    OTPUtil.sendOtpToSms(otp, mobileNumber),
    saveToken(otp, mobileNumber, expireTime, TOKEN_TYPES.LOGIN_OTP),
  ]);
  return otp;
}
