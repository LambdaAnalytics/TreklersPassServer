import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import { Token } from '../models/token.model';
import ApiError from '../utils/ApiError';
import { TOKEN_TYPES } from '../config/tokens';
import { loginDetails } from '../models/login.model';
import { USER_TYPES } from '../utils/constants';
import config from '../config/config';
import { User } from '../models';
import { UserType } from '../interfaces/User';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Login with username and password
 * @param {loginDetails} login
 * @returns {Promise<loginDetails>}
 */
export const createLogin = async (data) => {
  const login = { ...data };
  if (!login.password) {
    // generating some random password
    // login.password = Math.random().toString(36).slice(2)
    login.password = config.default.password;
  }
  if (!login.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Login ID Missing');
  }
  login._id = login.id;
  delete login.id;
  const loginData = await loginDetails.create(login);
  loginData.password = login.password;
  return loginData;
};

/**
 * Login with username and password
 * @param {string} userName
 * @param {string} password
 * @returns {Promise<any>}
 */
export const loginWithUserNameAndPassword = async (userName, password) => {
  const loginData = await loginDetails.findOne({ userName });
  if (!loginData || !(await loginData.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (loginData.type === USER_TYPES.DISABLED) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `Account Disabled, plz contact ${config.app.contactEmail || 'admin'}`);
  }
  throw new ApiError(httpStatus.UNAUTHORIZED, `Unauthorized, plz contact ${config.app.contactEmail || 'admin'}`);
};

export const loginWithMobileOtp = async (mobileNumber, otp) => {
  // console.log('Mobile No', mobileNumber);
  // console.log('OTP', otp);
  const tokenDoc = await Token.findOne({
    type: TOKEN_TYPES.LOGIN_OTP,
    userId: mobileNumber,
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'No OTP found, please generate OTP');
  }
  if (tokenDoc.expires < Date.now()) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Enterd OTP is exipred');
  }
  if (otp !== tokenDoc.token) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Please Check! Enterd OTP is Invalid');
  }
  await Token.deleteMany({
    type: TOKEN_TYPES.LOGIN_OTP,
    userId: mobileNumber,
  });
  let loginData = await User.findOne({ mobileNumber });
  if (!loginData) {
    loginData = await User.create(
      new UserType({
        mobileNumber,
      }),
    );
  }
  return loginData;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: TOKEN_TYPES.REFRESH });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
export const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, TOKEN_TYPES.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.userId);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ userId: user.id, type: TOKEN_TYPES.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
export const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, TOKEN_TYPES.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.userId);
    if (!user) {
      throw new Error();
    }
    const tokenData = tokenService.extractJwtPlayload(verifyEmailToken);
    await Token.deleteMany({ user: user.id, type: TOKEN_TYPES.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true, email: tokenData.email });
  } catch (error) {
    if (error && error.name === 'TokenExpiredError') {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Verification token expired !!, please verify again');
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
