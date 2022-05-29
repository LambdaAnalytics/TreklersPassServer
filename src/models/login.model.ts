import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { toJSON } from './plugins';
import { USER_TYPES, ALL_USER_TYPES } from '../utils/constants';
import { Role } from './role.schema';
import { DEFINED_ROLES } from '../config/roles';
import { LoginType } from '../interfaces/Login';

const loginSchema = new Schema<LoginType>(
  {
    _id: {
      type: String,
    },
    type: {
      type: String,
      enum: ALL_USER_TYPES,
      default: USER_TYPES.DRIVER,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      type: [Role],
      default: [DEFINED_ROLES.USER],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
loginSchema.plugin(toJSON);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
loginSchema.methods.isPasswordMatch = async function (password) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  return bcrypt.compare(password, user.password);
};

loginSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

/**
 * @typedef loginDetails
 */
export const loginDetails = model('loginDetails', loginSchema);
