import { Queue, Restaurant } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import calculateWaitTime from '../utils/calculateWaitTime.js';

export const recalculateQueuePositions = async (restaurantId) => {
  const waitingQueue = await Queue.find({
    restaurant: restaurantId,
    status: 'waiting',
  }).sort({ joinedAt: 1 });

  let position = 1;
  for (const entry of waitingQueue) {
    const restaurant = await Restaurant.findById(restaurantId);
    entry.position = position;
    entry.estimatedWaitMinutes = calculateWaitTime(
      position,
      restaurant?.avgSeatingTimeMinutes || 15
    );
    await entry.save();
    position++;
  }

  return waitingQueue;
};

export const joinQueue = async ({
  restaurantId,
  customerId,
  partySize = 1,
  preOrders = [],
  notes = '',
}) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw ApiError.notFound('Restaurant not found');
  }

  if (!restaurant.isOpen) {
    throw ApiError.badRequest('Restaurant is currently closed');
  }

  const existingEntry = await Queue.findOne({
    customer: customerId,
    restaurant: restaurantId,
    status: 'waiting',
  });
  if (existingEntry) {
    throw ApiError.conflict('You are already in the queue');
  }

  const position =
    (await Queue.countDocuments({
      restaurant: restaurantId,
      status: 'waiting',
    })) + 1;

  const queueEntry = await Queue.create({
    restaurant: restaurantId,
    customer: customerId,
    position,
    partySize,
    estimatedWaitMinutes: calculateWaitTime(
      position,
      restaurant.avgSeatingTimeMinutes
    ),
    preOrders,
    notes,
  });

  const populatedEntry = await Queue.findById(queueEntry._id)
    .populate('customer', 'name email')
    .populate('restaurant', 'name');

  return populatedEntry;
};

export const getQueueByRestaurant = async (restaurantId) => {
  const queue = await Queue.find({ restaurant: restaurantId })
    .sort({ position: 1 })
    .populate('customer', 'name email')
    .populate('restaurant', 'name avgSeatingTimeMinutes');

  return queue;
};

export const seatCustomer = async (queueId, restaurantId) => {
  const queueEntry = await Queue.findById(queueId);
  if (!queueEntry) {
    throw ApiError.notFound('Queue entry not found');
  }

  if (queueEntry.restaurant.toString() !== restaurantId) {
    throw ApiError.forbidden('Queue entry does not belong to this restaurant');
  }

  queueEntry.status = 'seated';
  await queueEntry.save();

  await recalculateQueuePositions(restaurantId);

  return queueEntry;
};

export const markNoShow = async (queueId, restaurantId) => {
  const queueEntry = await Queue.findById(queueId);
  if (!queueEntry) {
    throw ApiError.notFound('Queue entry not found');
  }

  if (queueEntry.restaurant.toString() !== restaurantId) {
    throw ApiError.forbidden('Queue entry does not belong to this restaurant');
  }

  queueEntry.status = 'no_show';
  await queueEntry.save();

  await recalculateQueuePositions(restaurantId);

  return queueEntry;
};

export const leaveQueue = async (queueId, customerId) => {
  const queueEntry = await Queue.findById(queueId);
  if (!queueEntry) {
    throw ApiError.notFound('Queue entry not found');
  }

  if (queueEntry.customer.toString() !== customerId) {
    throw ApiError.forbidden('You can only leave your own queue entry');
  }

  const restaurantId = queueEntry.restaurant;
  queueEntry.status = 'left';
  await queueEntry.save();

  await recalculateQueuePositions(restaurantId);

  return queueEntry;
};

export const getCustomerQueue = async (customerId, restaurantId) => {
  const queueEntry = await Queue.findOne({
    customer: customerId,
    restaurant: restaurantId,
    status: 'waiting',
  })
    .populate('customer', 'name email')
    .populate('restaurant', 'name avgSeatingTimeMinutes');

  return queueEntry;
};

export const removeByOwner = async (queueId, restaurantId) => {
  const queueEntry = await Queue.findById(queueId);
  if (!queueEntry) {
    throw ApiError.notFound('Queue entry not found');
  }

  if (queueEntry.restaurant.toString() !== restaurantId) {
    throw ApiError.forbidden('Queue entry does not belong to this restaurant');
  }

  const queueEntryRestaurantId = queueEntry.restaurant;
  queueEntry.status = 'removed_by_owner';
  await queueEntry.save();

  await recalculateQueuePositions(queueEntryRestaurantId);

  return queueEntry;
};

export default {
  joinQueue,
  getQueueByRestaurant,
  seatCustomer,
  markNoShow,
  leaveQueue,
  getCustomerQueue,
  removeByOwner,
  recalculateQueuePositions,
};
