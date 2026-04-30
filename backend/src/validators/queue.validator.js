import { body, param, validationResult } from 'express-validator';

export const joinQueueValidator = [
  body('restaurantId')
    .notEmpty()
    .withMessage('Restaurant ID is required')
    .isMongoId(),
  body('partySize')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Party size must be between 1 and 20'),
];

export const queueIdValidator = [
  param('id').notEmpty().withMessage('Queue ID is required').isMongoId(),
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
