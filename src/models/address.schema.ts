import { Schema } from 'mongoose';

export const Address = new Schema({
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
  },
  coordinates: {
    type: [Number],
  },
});
