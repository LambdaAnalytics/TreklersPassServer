const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'SPT API documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}/v1`,
    },
  ],
};

module.exports = swaggerDef;
