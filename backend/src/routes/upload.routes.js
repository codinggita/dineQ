import express from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireStaff } from '../middleware/role.middleware.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  requireStaff,
  upload.single('image'),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'No file uploaded',
          data: null
        });
      }

      // Return the URL to access the uploaded file
      const imageUrl = `/uploads/${req.file.filename}`;
      
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Image uploaded successfully',
        data: { url: imageUrl }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error uploading image',
        data: null
      });
    }
  }
);

export default router;
