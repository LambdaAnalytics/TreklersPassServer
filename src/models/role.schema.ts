const { Schema } = require('mongoose');
const { DEFINED_ROLES_LIST, DEFINED_ROLES } = require('../config/roles');

export const Role = new Schema({
  // if changed/added new fields have to synchronize validations ()
  _id: {
    type: String,
    default: DEFINED_ROLES.USER.id,
  },
  value: {
    type: String,
    default: DEFINED_ROLES.USER.value,
    enum: DEFINED_ROLES_LIST,
  },
  label: {
    type: String,
    default: DEFINED_ROLES.USER.label,
  },
  permissions: {
    type: [Number],
    default: [],
  },
});
