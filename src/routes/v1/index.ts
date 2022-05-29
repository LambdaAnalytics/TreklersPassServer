import express from 'express';
import path from 'path';
import { commonRoutes } from './common.route';
import authRoute from './auth.route';
import userRoute from './user.route';
import adminRoute from './admin.route';
import docsRoute from './docs.route';
import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/common',
    route: commonRoutes,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs/swagger-ui.css',
    route: (req, res) => {
      res.setHeader('content-type', 'text/css');
      res.sendFile(path.resolve());
    },
  },
  {
    path: '/docs/:file',
    route: (req, res, next) => {
      if (req.params.file === 'swagger-ui-init.js') return next();
      const filePath = path.resolve(`node_modules/swagger-ui-dist/${req.params.file}`);
      let type = 'application/json';
      if (filePath.includes('.js')) {
        type = 'text/javascript';
      } else if (filePath.includes('.css')) {
        type = 'text/css';
      } else if (filePath.includes('.html')) {
        type = 'text/html';
      } else if (filePath.includes('.png')) {
        type = 'image/png';
      } else if (filePath.includes('.jpg')) {
        type = 'image/jpg';
      }
      res.setHeader('content-type', type);
      res.sendFile(filePath);
    },
  },
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
