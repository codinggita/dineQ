import express from 'express';
import * as queueController from '../controllers/queue.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireStaff } from '../middleware/role.middleware.js';
import {
  joinQueueValidator,
  queueIdValidator,
  validateResult,
} from '../validators/queue.validator.js';

const router = express.Router();

router.post(
  '/join',
  authenticate,
  joinQueueValidator,
  validateResult,
  queueController.joinQueue
);
router.get(
  '/:restaurantId',
  authenticate,
  requireStaff,
  queueController.getQueueByRestaurant
);
router.patch(
  '/:id/seat',
  authenticate,
  requireStaff,
  queueController.seatCustomer
);
router.patch(
  '/:id/no-show',
  authenticate,
  requireStaff,
  queueController.markNoShow
);
router.delete('/:id', authenticate, requireStaff, queueController.leaveQueue);
router.delete(
  '/:id/remove',
  authenticate,
  requireStaff,
  queueController.removeByOwner
);
router.post(
  '/:queueId/reminder',
  authenticate,
  requireStaff,
  queueController.sendReminder
);

export default router;
