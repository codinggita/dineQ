import { body, validationResult } from 'express-validator';

export const submitRatingValidator = [
  body('restaurantId')
    .notEmpty()
    .withMessage('Restaurant ID is required')
    .isMongoId(),
  body('score')
    .custom((value) => {
      const num = Number(value);
      return Number.isInteger(num) && num >= 1 && num <= 5;
    })
    .withMessage('Score must be an integer between 1 and 5'),
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
