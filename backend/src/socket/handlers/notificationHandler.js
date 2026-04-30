import { SOCKET_EVENTS, SOCKET_ROOMS } from '../socketEvents.js';
import { getIO } from '../index.js';

const CLAIM_WINDOW_SECONDS = 300;

export const notifyTableReady = async (
  customerId,
  restaurantId,
  restaurantName
) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.CUSTOMER(customerId)).emit(SOCKET_EVENTS.TABLE_READY, {
    message: `Your table at ${restaurantName} is ready!`,
    claimWindowSeconds: CLAIM_WINDOW_SECONDS,
    restaurantId,
  });
};

export const notifyQueueUpdate = async (restaurantId, queue, avgWaitTime) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.QUEUE_UPDATED,
    {
      queue,
      avgWaitTime,
    }
  );
};

export const notifyWaitTimeUpdate = async (restaurantId, newWaitTime) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.WAIT_TIME_UPDATE,
    {
      restaurantId,
      newWaitTime,
    }
  );
};

export const notifyCustomerJoined = async (
  restaurantId,
  customerName,
  position
) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.CUSTOMER_JOINED,
    {
      customerName,
      position,
    }
  );
};

export const notifyCustomerSeated = async (
  restaurantId,
  customerName,
  position
) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.CUSTOMER_SEATED,
    {
      customerName,
      position,
    }
  );
};

export const notifyCustomerLeft = async (
  restaurantId,
  customerName,
  position
) => {
  const io = getIO();
  io.to(SOCKET_ROOMS.RESTAURANT(restaurantId)).emit(
    SOCKET_EVENTS.CUSTOMER_LEFT,
    {
      customerName,
      position,
    }
  );
};

export default {
  notifyTableReady,
  notifyQueueUpdate,
  notifyWaitTimeUpdate,
  notifyCustomerJoined,
  notifyCustomerSeated,
  notifyCustomerLeft,
};
