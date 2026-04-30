import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { SOCKET_EVENTS, SOCKET_ROOMS } from './socketEvents.js';
import {
  handleJoinQueue,
  handleSeatCustomer,
  handleNoShow,
} from './handlers/queueHandler.js';
import {
  handlePreorderReceived,
  handleOrderStatusUpdate,
} from './handlers/orderHandler.js';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Room joining handlers
    socket.on('join_restaurant_room', ({ restaurantId }) => {
      if (restaurantId) {
        socket.join(SOCKET_ROOMS.RESTAURANT(restaurantId));
        console.log(`Socket ${socket.id} joined restaurant room: ${restaurantId}`);
      }
    });

    socket.on('join_staff_room', ({ restaurantId }) => {
      if (restaurantId) {
        socket.join(SOCKET_ROOMS.STAFF(restaurantId));
        socket.join(SOCKET_ROOMS.RESTAURANT(restaurantId)); // staff also listens on restaurant room
        console.log(`Socket ${socket.id} joined staff room: ${restaurantId}`);
      }
    });

    socket.on('join_customer_room', ({ customerId }) => {
      if (customerId) {
        socket.join(SOCKET_ROOMS.CUSTOMER(customerId));
        console.log(`Socket ${socket.id} joined customer room: ${customerId}`);
      }
    });

    socket.on(SOCKET_EVENTS.JOIN_QUEUE, (data) =>
      handleJoinQueue(socket, data)
    );
    socket.on('seat_customer', (data) => handleSeatCustomer(socket, data));
    socket.on(SOCKET_EVENTS.NO_SHOW, (data) => handleNoShow(socket, data));
    socket.on(SOCKET_EVENTS.PREORDER_RECEIVED, (data) =>
      handlePreorderReceived(socket, data)
    );
    socket.on('update_order_status', (data) =>
      handleOrderStatusUpdate(socket, data)
    );

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

export default { initializeSocket, getIO };
