import { Schema, Model, model } from 'mongoose';
import validator from 'validator';
import { PaginateFn } from '../interfaces/PaginateFn';
import { toJSON, paginate } from './plugins';
import { getValueForNextSequence } from './sequence.model';
import { PREFIX } from '../utils/constants';
import { Address } from './address.schema';
import { UserType } from '../interfaces/User';

interface UserModelType extends Model<UserType> {
  // isEmailTaken(email: string, excludeId?: string): Promise<boolean>;
  // isMobileNumberTaken(mobileNumber: string, excludeId?: string): Promise<boolean>;
  paginate: PaginateFn<UserType>;
}

const userSchema = new Schema<UserModelType>(
  {
    _id: {
      type: String,
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      /*  validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      }, */
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, 'en-IN')) {
          throw new Error('Invalid mobile number');
        }
      },
    },
    experience: {
      type: String,
    },
    driverType: {
      type: Array,
    },
    address: {
      type: Address,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    userType: {
      type: String,
    },
    minExp: {
      type: Number,
    },
    maxExp: {
      type: Number,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    privacyPolicy: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user.isNew) {
    user._id = PREFIX.USER + (await getValueForNextSequence(PREFIX.USER));
  }
  next();
});

/**
 * @typedef User
 */
export const User = model<UserType, UserModelType>('User', userSchema);
