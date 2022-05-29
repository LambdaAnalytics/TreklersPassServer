import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService, emailService } from '../services';
import logger from '../config/logger';
import config from '../config/config';
import { USER_TYPES } from '../utils/constants';
import { createLogin } from '../services/auth.service';
import { extractJwtTokenFromString } from '../services/token.service';
import { UserType } from '../interfaces/User';

export const register = catchAsync(async (req, res) => {
  const { password, ...userData } = req.body;
  const user = (await userService.createUser(userData)) as unknown as UserType;
  await createLogin({
    id: user.id,
    userName: user.mobileNumber,
    password,
    type: USER_TYPES.DRIVER,
  });
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const login = catchAsync(async (req, res) => {
  const { userName, password } = req.body;
  const loginData = await authService.loginWithUserNameAndPassword(userName, password);
  const tokens = await tokenService.generateAuthTokens(loginData);
  res.send({ loginData, tokens });
});

export const loginWithMobileOtp = catchAsync(async (req, res) => {
  const { mobileNumber, otp } = req.body;
  try {
    const loginData = await authService.loginWithMobileOtp(mobileNumber, otp);
    const tokens = await tokenService.generateAuthTokens(loginData);
    res.send({ statusCode: 200, loginData, tokens });
  } catch (error) {
    //  console.log('Error In API', error.message);
    res.send({ statusCode: 500, message: error.message });
  }
});

export const logout = catchAsync(async (req, res) => {
  const refreshToken = req.body.refreshToken || extractJwtTokenFromString(req.header('AuthToken'));
  await authService.logout(refreshToken);
  res.status(httpStatus.OK).send({ message: 'Done' });
});

export const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(user);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.OK).send({ message: 'Done' });
});

export const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.OK).send({ message: 'Done' });
});

export const sendVerificationEmail = catchAsync(async (req, res) => {
  try {
    const user = (await userService.getUserById(req.userId)) as unknown as UserType;
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(user.email, verifyEmailToken);
    res.status(httpStatus.OK).send({ message: 'email verification link sent to email' });
  } catch (error) {
    logger.error(error);
    res.status(httpStatus.OK).send({ message: 'Unable to send email verification link, plz try again' });
  }
});

export const verifyEmail = catchAsync(async (req, res) => {
  try {
    await authService.verifyEmail(req.query.token);
    res.redirect(`${config.server.adminPortalEndpoint}`);
  } catch (error) {
    logger.error(error);
    res.status(httpStatus.OK).send({ message: 'Email verified failed, please try again' });
  }
});

export const generateOTP = catchAsync(async (req, res) => {
  try {
    const otp = await tokenService.generateOTP(req.params.mobileNumber);
    const respObj = { otp, message: `OTP Sent successfully` };
    res.status(httpStatus.OK).send(respObj);
  } catch (error) {
    logger.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error.message });
  }
});
