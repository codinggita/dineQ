import { body, param, validationResult } from 'express-validator';

export const createOrderValidator = [
  body('queueId').notEmpty().withMessage('Queue ID is required').isMongoId(),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items array is required and cannot be empty'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.qty')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be at least 1'),
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Item price must be positive'),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount is required'),
];

export const orderIdValidator = [
  param('id').notEmpty().withMessage('Order ID is required').isMongoId(),
];

export const updateOrderStatusValidator = [
  param('id').notEmpty().withMessage('Order ID is required').isMongoId(),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'preparing', 'ready', 'served']),
];

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation failed',
      data: errors
        .array()
        .map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};
