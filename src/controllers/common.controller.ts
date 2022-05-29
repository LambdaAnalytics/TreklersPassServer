import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { commonService } from '../services';

export const createConstantSet = catchAsync(async (req, res) => {
  const { key } = req.params;
  if (!key) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid key');
  }
  const constantSet = await commonService.createConstantSet(key, req.body);
  if (!constantSet) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid key');
  }
  res.status(httpStatus.CREATED).send({ [key]: constantSet });
});

export const getConstantSet = catchAsync(async (req, res) => {
  const { key } = req.params;
  if (!key) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid key');
  }
  const constantSet = await commonService.getConstantSet(key);
  if (!constantSet) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }
  res.send({ [key]: constantSet?.value });
});

export const updateConstantSet = catchAsync(async (req, res) => {
  const user = await commonService.createConstantSet(req.params.key, req.body);
  res.send(user);
});

export const deleteConstantSet = catchAsync(async (req, res) => {
  await commonService.removeConstantSet(req.params.key);
  res.status(httpStatus.OK).send({ message: 'Data Deleted' });
});
