import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService, authService } from '../services';
import { USER_TYPES } from '../utils/constants';
import { UserType } from '../interfaces/User';

export const createUser = catchAsync(async (req, res) => {
  const { password, ...userData } = req.body;
  const user = (await userService.createUser(userData)) as unknown as UserType;
  await authService.createLogin({
    id: user.id,
    userName: user.mobileNumber,
    type: USER_TYPES.DRIVER,
    password,
  });
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'roles']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.OK).send({ message: 'User Deleted' });
});
