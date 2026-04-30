import { Order, Queue, Restaurant } from '../models/index.js';
import ApiError from '../utils/ApiError.js';

export const createOrder = async ({
  queueId,
  customerId,
  items,
  totalAmount,
}) => {
  const queueEntry = await Queue.findById(queueId);
  if (!queueEntry) {
    throw ApiError.notFound('Queue entry not found');
  }

  if (queueEntry.customer.toString() !== customerId) {
    throw ApiError.forbidden(
      'You can only place orders for your own queue entry'
    );
  }

  if (queueEntry.status !== 'waiting') {
    throw ApiError.badRequest('You can only place orders while in the queue');
  }

  const restaurant = await Restaurant.findById(queueEntry.restaurant);
  if (!restaurant) {
    throw ApiError.notFound('Restaurant not found');
  }

  const order = await Order.create({
    queue: queueId,
    restaurant: queueEntry.restaurant,
    customer: customerId,
    items,
    totalAmount,
    status: 'pending',
  });

  return order;
};

export const getOrderByQueue = async (queueId) => {
  const order = await Order.findOne({ queue: queueId })
    .populate('customer', 'name email')
    .populate('restaurant', 'name');

  return order;
};

export const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('customer', 'name email')
    .populate('restaurant', 'name');

  return order;
};

export const updateOrderStatus = async (orderId, status, restaurantId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (order.restaurant.toString() !== restaurantId) {
    throw ApiError.forbidden('Order does not belong to this restaurant');
  }

  const validTransitions = {
    pending: ['preparing'],
    preparing: ['ready'],
    ready: ['served'],
    served: [],
  };

  if (!validTransitions[order.status]?.includes(status)) {
    throw ApiError.badRequest(
      `Cannot change status from ${order.status} to ${status}`
    );
  }

  order.status = status;
  await order.save();

  return order;
};

export const getOrdersByRestaurant = async (restaurantId) => {
  const orders = await Order.find({ restaurant: restaurantId })
    .sort({ createdAt: -1 })
    .populate('customer', 'name email')
    .populate('queue', 'position partySize');

  return orders;
};

export default {
  createOrder,
  getOrderByQueue,
  getOrderById,
  updateOrderStatus,
  getOrdersByRestaurant,
};
