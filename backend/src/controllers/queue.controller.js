import * as queueService from '../services/queue.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getIO } from '../socket/index.js';
import { SOCKET_EVENTS, SOCKET_ROOMS } from '../socket/socketEvents.js';
import { Queue } from '../models/index.js';
import calculateWaitTime from '../utils/calculateWaitTime.js';

export const joinQueue = asyncHandler(async (req, res) => {
  const result = await queueService.joinQueue({
    restaurantId: req.body.restaurantId,
    customerId: req.user._id,
    partySize: req.body.partySize || 1,
    preOrders: req.body.preOrders || [],
    notes: req.body.notes || '',
  });

  // Fire socket events so the owner dashboard updates in real-time
  try {
    const io = getIO();
    const restaurantId = req.body.restaurantId;

    // Notify owner: new customer joined (with preorder info)
    io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
      SOCKET_EVENTS.CUSTOMER_JOINED,
      {
        id: result._id,
        customerName: result.customer?.name || 'Guest',
        partySize: result.partySize,
        position: result.position,
        estimatedWaitMinutes: result.estimatedWaitMinutes,
        preOrders: result.preOrders || [],
        notes: result.notes || '',
        joinedAt: result.joinedAt,
        phone: result.customer?.phone || '',
      }
    );

    // Send updated full queue to owner
    const queue = await Queue.find({
      restaurant: restaurantId,
      status: 'waiting',
    })
      .sort({ position: 1 })
      .populate('customer', 'name phone');

    const restaurant = result.restaurant;
    const avgWaitTime =
      queue.length > 0
        ? calculateWaitTime(
          queue.length,
          restaurant?.avgSeatingTimeMinutes || 15
        )
        : 0;

    io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
      SOCKET_EVENTS.QUEUE_UPDATED,
      {
        queue: queue.map((q) => ({
          id: q._id,
          customerName: q.customer?.name || 'Guest',
          phone: q.customer?.phone || '',
          partySize: q.partySize,
          position: q.position,
          estimatedWaitMinutes: q.estimatedWaitMinutes,
          status: q.status,
          preOrders: q.preOrders || [],
          notes: q.notes || '',
          joinedAt: q.joinedAt,
        })),
        avgWaitTime,
      }
    );
  } catch (socketErr) {
    console.error('Socket emit error on join:', socketErr.message);
  }

  ApiResponse.created(res, 'Joined queue successfully', result);
});

export const getQueueByRestaurant = asyncHandler(async (req, res) => {
  const result = await queueService.getQueueByRestaurant(
    req.params.restaurantId
  );
  ApiResponse.success(res, 'Queue fetched successfully', result);
});

export const seatCustomer = asyncHandler(async (req, res) => {
  const result = await queueService.seatCustomer(
    req.params.id,
    req.body.restaurantId
  );
  ApiResponse.success(res, 'Customer seated successfully', result);
});

export const markNoShow = asyncHandler(async (req, res) => {
  const result = await queueService.markNoShow(
    req.params.id,
    req.body.restaurantId
  );
  ApiResponse.success(res, 'Marked as no-show', result);
});

export const leaveQueue = asyncHandler(async (req, res) => {
  const result = await queueService.leaveQueue(req.params.id, req.user._id);
  ApiResponse.success(res, 'Left queue successfully', result);
});

export const getCustomerQueue = asyncHandler(async (req, res) => {
  const result = await queueService.getCustomerQueue(
    req.user._id,
    req.params.restaurantId
  );
  ApiResponse.success(res, 'Customer queue fetched', result);
});

export const removeByOwner = asyncHandler(async (req, res) => {
  const result = await queueService.removeByOwner(
    req.params.id,
    req.body.restaurantId
  );
  ApiResponse.success(res, 'Party removed from queue by owner', result);
});

// Send a reminder notification to a specific customer in the queue
export const sendReminder = asyncHandler(async (req, res) => {
  const { queueId } = req.params;
  const queueEntry = await Queue.findById(queueId)
    .populate('customer', 'name')
    .populate('restaurant', 'name');

  if (!queueEntry) {
    return res
      .status(404)
      .json({ success: false, message: 'Queue entry not found' });
  }

  try {
    const io = getIO();
    io.to(SOCKET_ROOMS.CUSTOMER(queueEntry.customer._id.toString())).emit(
      SOCKET_EVENTS.TABLE_READY,
      {
        message: `⏰ Reminder: Your table at ${queueEntry.restaurant?.name} is almost ready! Please be nearby.`,
        restaurantName: queueEntry.restaurant?.name,
        position: queueEntry.position,
        estimatedWaitMinutes: queueEntry.estimatedWaitMinutes,
        isReminder: true,
      }
    );
  } catch (e) {
    console.error('Reminder socket error:', e.message);
  }

  ApiResponse.success(res, 'Reminder sent successfully', null);
});

export default {
  joinQueue,
  getQueueByRestaurant,
  seatCustomer,
  markNoShow,
  leaveQueue,
  getCustomerQueue,
  sendReminder,
};
