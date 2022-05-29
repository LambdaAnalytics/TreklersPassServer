const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const {
  extractJwtPlayload,
  verifyToken,
  extractJwtTokenFromString,
  generateAuthTokens,
} = require('../services/token.service');
const { TOKEN_TYPES } = require('../config/tokens');
const logger = require('../config/logger');
const { DEFINED_ROLES } = require('../config/roles');

const verifyCallback = (req, res, resolve, reject, requiredRights) => async () => {
  // disabling auth for temporary period of time TBD
  // disabling code start
  if (req) {
    resolve();
    return;
  }
  // disabling code end
  const accessToken = extractJwtTokenFromString(req.header('Authorization'));
  const authToken = extractJwtTokenFromString(req.header('AuthToken'));
  if (!accessToken) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  try {
    const tokenData = extractJwtPlayload(accessToken);
    if (!tokenData || tokenData.type !== TOKEN_TYPES.ACCESS) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    const permissions = [];
    if (Array.isArray(tokenData.roles)) {
      for (let i = 0; i < tokenData.roles.length; i += 1) {
        const role = tokenData.roles[i];
        if (role && role.value) {
          if (role.value === 'CUSTOM_ROLES') {
            if (Array.isArray(role)) {
              permissions.push(...role.permissions);
            }
          } else if (DEFINED_ROLES[role.value]) {
            permissions.push(...DEFINED_ROLES[role.value].permissions);
          }
        }
      }
    }

    req.userId = tokenData.userId;
    req.userRoles = tokenData.roles;
    req.permissions = permissions;
  } catch (error) {
    if (error && error.name === 'TokenExpiredError') {
      await verifyToken(authToken, TOKEN_TYPES.REFRESH);
      const tokenData = extractJwtPlayload(authToken);
      if (!tokenData || tokenData.type !== TOKEN_TYPES.REFRESH) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      }
      req.userId = tokenData.userId;
      req.userRoles = tokenData.roles;
      const newAccessToken = await generateAuthTokens(
        {
          id: tokenData.userId,
          roles: tokenData.roles,
        },
        [TOKEN_TYPES.REFRESH],
      );
      logger.info('Token Veried in DB');
      res.set('Access-Control-Expose-Headers', 'x-auth-token');
      res.set('x-auth-token', newAccessToken.authToken);
    } else {
      logger.error(error);
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }
  if (!req.userRoles) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  }
  if (requiredRights.length) {
    const hasRequiredRights = requiredRights.every((requiredRight) => req.permissions.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== req.userId) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }
  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, res, resolve, reject, requiredRights))(
        req,
        res,
        next,
      );
    })
      .then(() => next())
      .catch((err) => {
        next(err);
      });
  };

module.exports = auth;
