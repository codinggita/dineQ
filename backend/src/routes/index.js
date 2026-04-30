import express from 'express';
import authRoutes from './auth.routes.js';
import restaurantRoutes from './restaurant.routes.js';
import queueRoutes from './queue.routes.js';
import orderRoutes from './order.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/queue', queueRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    statusCode: 200,
    message: 'API is running',
    data: null,
  });
});

export default router;
