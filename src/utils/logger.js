var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'hrbusinesserver',
  streams: [
    {
      level: 'info',
      path: './info-log.log'
      // stream : process.stdout
    },
    {
      level: 'error',
      path: './error-log.log'
    }
  ],
  serializers: bunyan.stdSerializers
})

module.exports = log;