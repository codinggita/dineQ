import ApiError from '../utils/ApiError.js';

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden('Access denied. Insufficient permissions')
      );
    }

    next();
  };

export const requireStaff = authorize('staff');
export const requireCustomer = authorize('customer');

export default authorize;
