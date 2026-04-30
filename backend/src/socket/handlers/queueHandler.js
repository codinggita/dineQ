import { Queue, Restaurant } from '../../models/index.js';
import { SOCKET_EVENTS, SOCKET_ROOMS } from '../socketEvents.js';
import { getIO } from '../index.js';
import calculateWaitTime from '../../utils/calculateWaitTime.js';

export const handleJoinQueue = async (socket, data) => {
  try {
    const { restaurantId, customerId, partySize } = data;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant || !restaurant.isOpen) {
      socket.emit(SOCKET_EVENTS.ERROR, { message: 'Restaurant is closed' });
      return;
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
      estimatedWaitTimeMinutes: calculateWaitTime(
        position,
        restaurant.avgSeatingTimeMinutes
      ),
      socketId: socket.id,
    });

    socket.join(SOCKET_ROOMS.RESTAURANT(restaurantId));
    socket.join(SOCKET_ROOMS.CUSTOMER(customerId));

    const io = getIO();
    const queue = await Queue.find({
      restaurant: restaurantId,
      status: 'waiting',
    })
      .sort({ position: 1 })
      .populate('customer', 'name')
      .populate('restaurant', 'name avgSeatingTimeMinutes');

    const avgWaitTime =
      queue.length > 0
        ? calculateWaitTime(queue.length, restaurant.avgSeatingTimeMinutes)
        : 0;

    io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
      SOCKET_EVENTS.QUEUE_UPDATED,
      {
        queue: queue.map((q) => ({
          id: q._id,
          position: q.position,
          partySize: q.partySize,
          estimatedWaitMinutes: q.estimatedWaitMinutes,
          customerName: q.customer?.name,
          joinedAt: q.joinedAt,
          preOrders: q.preOrders || [],
          notes: q.notes || '',
        })),
        avgWaitTime,
      }
    );

    return queueEntry;
  } catch (error) {
    console.error('handleJoinQueue error:', error);
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
  }
};

export const handleSeatCustomer = async (socket, data) => {
  try {
    const { queueEntryId, restaurantId } = data;
    const queueEntry = await Queue.findById(queueEntryId);

    if (!queueEntry) {
      throw new Error('Queue entry not found');
    }

    queueEntry.status = 'seated';
    await queueEntry.save();

    const io = getIO();
    const queue = await Queue.find({
      restaurant: restaurantId,
      status: 'waiting',
    })
      .sort({ position: 1 })
      .populate('customer', 'name');

    for (let i = 0; i < queue.length; i++) {
      queue[i].position = i + 1;
      await queue[i].save();
    }

    const restaurant = await Restaurant.findById(restaurantId);
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
          position: q.position,
          partySize: q.partySize,
          estimatedWaitMinutes: q.estimatedWaitMinutes,
          customerName: q.customer?.name,
        })),
        avgWaitTime,
      }
    );
  } catch (error) {
    console.error('handleSeatCustomer error:', error);
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
  }
};

export const handleNoShow = async (socket, data) => {
  try {
    const { queueEntryId, restaurantId } = data;
    const queueEntry = await Queue.findById(queueEntryId);

    if (!queueEntry) {
      throw new Error('Queue entry not found');
    }

    queueEntry.status = 'no_show';
    await queueEntry.save();

    const io = getIO();
    const queue = await Queue.find({
      restaurant: restaurantId,
      status: 'waiting',
    })
      .sort({ position: 1 })
      .populate('customer', 'name');

    for (let i = 0; i < queue.length; i++) {
      queue[i].position = i + 1;
      await queue[i].save();
    }

    const restaurant = await Restaurant.findById(restaurantId);
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
          position: q.position,
          partySize: q.partySize,
          estimatedWaitMinutes: q.estimatedWaitMinutes,
          customerName: q.customer?.name,
        })),
        avgWaitTime,
      }
    );
  } catch (error) {
    console.error('handleNoShow error:', error);
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
  }
};

export default { handleJoinQueue, handleSeatCustomer, handleNoShow };
