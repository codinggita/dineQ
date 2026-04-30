import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireStaff } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/', authenticate, orderController.createOrder);
router.get('/queue/:queueId', authenticate, orderController.getOrderByQueue);
router.get(
  '/restaurant/:restaurantId',
  authenticate,
  requireStaff,
  orderController.getOrdersByRestaurant
);
router.patch(
  '/:id/status',
  authenticate,
  requireStaff,
  orderController.updateOrderStatus
);

export default router;
