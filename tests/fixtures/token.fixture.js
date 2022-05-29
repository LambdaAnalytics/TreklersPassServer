const moment = require('moment');
const config = require('../../src/config/config');
const { TOKEN_TYPES } = require('../../src/config/tokens');
const tokenService = require('../../src/services/token.service');
const { userOne, admin } = require('./user.fixture');

const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
const userOneAccessToken = tokenService.generateToken(userOne, accessTokenExpires, TOKEN_TYPES.ACCESS);
const adminAccessToken = tokenService.generateToken(admin, accessTokenExpires, TOKEN_TYPES.ACCESS);

module.exports = {
  userOneAccessToken,
  adminAccessToken,
};
