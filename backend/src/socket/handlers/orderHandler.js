import { Order, Queue } from '../../models/index.js';
import { SOCKET_EVENTS, SOCKET_ROOMS } from '../socketEvents.js';
import { getIO } from '../index.js';

export const handlePreorderReceived = async (socket, data) => {
  try {
    const { queueId, items, totalAmount, customerId } = data;

    const queueEntry = await Queue.findById(queueId).populate(
      'customer',
      'name'
    );
    if (!queueEntry) {
      throw new Error('Queue entry not found');
    }

    const orderItems = items.map((item) => ({
      name: item.name,
      qty: item.quantity || item.qty || 1,
      price: item.price,
    }));

    const order = await Order.create({
      queue: queueId,
      restaurant: queueEntry.restaurant,
      customer: customerId,
      items: orderItems,
      totalAmount,
      status: 'pending',
    });

    const io = getIO();
    const restaurantId = queueEntry.restaurant.toString();

    io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
      SOCKET_EVENTS.PREORDER_RECEIVED,
      {
        orderId: order._id,
        queueId,
        items,
        totalAmount,
        customerId,
        status: 'pending',
        customerName: queueEntry.customer?.name || 'Guest',
        partySize: queueEntry.partySize,
        position: queueEntry.position,
        estimatedWaitMinutes: queueEntry.estimatedWaitMinutes,
      }
    );

    return order;
  } catch (error) {
    console.error('handlePreorderReceived error:', error);
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
  }
};

export const handleOrderStatusUpdate = async (socket, data) => {
  try {
    const { orderId, status, restaurantId } = data;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    const io = getIO();
    const customerId = order.customer.toString();

    io.to(SOCKET_ROOMS.CUSTOMER(customerId)).emit(
      SOCKET_EVENTS.ORDER_STATUS_UPDATED,
      {
        orderId,
        status,
      }
    );

    io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
      SOCKET_EVENTS.ORDER_STATUS_UPDATED,
      {
        orderId,
        status,
      }
    );

    return order;
  } catch (error) {
    console.error('handleOrderStatusUpdate error:', error);
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.message });
  }
};

export default { handlePreorderReceived, handleOrderStatusUpdate };
