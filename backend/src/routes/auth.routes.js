import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  validateResult,
} from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/register',
  registerValidator,
  validateResult,
  authController.register
);
router.post('/login', loginValidator, validateResult, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.patch(
  '/profile',
  authenticate,
  updateProfileValidator,
  validateResult,
  authController.updateProfile
);
router.post(
  '/avatar',
  authenticate,
  upload.single('image'),
  authController.uploadAvatar
);

export default router;
