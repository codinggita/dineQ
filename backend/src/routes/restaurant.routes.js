import express from 'express';
import * as restaurantController from '../controllers/restaurant.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireStaff } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', restaurantController.getAllRestaurants);
router.get(
  '/me',
  authenticate,
  requireStaff,
  restaurantController.getMyRestaurant
);
router.get('/:id', restaurantController.getRestaurantById);
router.post(
  '/',
  authenticate,
  requireStaff,
  restaurantController.createRestaurant
);
router.patch(
  '/:id',
  authenticate,
  requireStaff,
  restaurantController.updateRestaurant
);

export default router;
