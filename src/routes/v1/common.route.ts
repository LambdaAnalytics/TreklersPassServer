import express from 'express';
import { commonController, userController } from '../../controllers';
import auth from '../../middlewares/auth';

const commonRoutes = express.Router();

commonRoutes
  .route('/constantsets/:key')
  // TODO: add ADMIN_ROLE in auth()
  .post(auth(), commonController.createConstantSet)
  .get(auth(), commonController.getConstantSet)
  // TODO: add ADMIN_ROLE in auth()
  .patch(auth(), commonController.updateConstantSet)
  // TODO: add ADMIN_ROLE in auth()
  .delete(auth(), commonController.deleteConstantSet);

export { commonRoutes };
/**
 * @swagger
 * tags:
 *   name: Common Routes
 *   description: Common Routes
 */

/**
 * @swagger
 * /common/constantsets/:key:
 *   post:
 *     summary: Create a constantset
 *     description: Only admins can create constantset.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *               - value
 *             properties:
 *               name:
 *                 type: string
 *                 description: must be unique
 *               value:
 *                 type: unknown
 *                 description: must be unique
 *             example:
 *               name: experienceList
 *               value: ['1 to 2 years', '3 to 4 years']
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *  get:
 *     summary: get a constantset
 *     description: Only login users can get constantset.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - key
 *             properties:
 *               key:
 *                 type: string
 *                 description: must be unique
 *             example:
 *               [key]: ['1 to 2 years', '3 to 4 years']
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/User'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 */
