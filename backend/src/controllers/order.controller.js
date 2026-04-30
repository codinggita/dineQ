import * as orderService from '../services/order.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const result = await orderService.createOrder({
    queueId: req.body.queueId,
    customerId: req.user._id,
    items: req.body.items,
    totalAmount: req.body.totalAmount,
  });
  ApiResponse.created(res, 'Order placed successfully', result);
});

export const getOrderByQueue = asyncHandler(async (req, res) => {
  const result = await orderService.getOrderByQueue(req.params.queueId);
  ApiResponse.success(res, 'Order fetched successfully', result);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const result = await orderService.getOrderById(req.params.id);
  ApiResponse.success(res, 'Order fetched successfully', result);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const result = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status,
    req.body.restaurantId
  );
  ApiResponse.success(res, 'Order status updated', result);
});

export const getOrdersByRestaurant = asyncHandler(async (req, res) => {
  const result = await orderService.getOrdersByRestaurant(
    req.params.restaurantId
  );
  ApiResponse.success(res, 'Orders fetched successfully', result);
});

export default {
  createOrder,
  getOrderByQueue,
  getOrderById,
  updateOrderStatus,
  getOrdersByRestaurant,
};
