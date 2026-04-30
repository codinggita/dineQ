import { SOCKET_ROOMS } from './socketEvents.js';

export const joinRestaurantRoom = (socket, restaurantId) => {
  socket.join(SOCKET_ROOMS.RESTAURANT(restaurantId));
};

export const joinStaffRoom = (socket, restaurantId) => {
  socket.join(SOCKET_ROOMS.STAFF(restaurantId));
};

export const joinCustomerRoom = (socket, customerId) => {
  socket.join(SOCKET_ROOMS.CUSTOMER(customerId));
};

export const leaveRestaurantRoom = (socket, restaurantId) => {
  socket.leave(SOCKET_ROOMS.RESTAURANT(restaurantId));
};

export const leaveStaffRoom = (socket, restaurantId) => {
  socket.leave(SOCKET_ROOMS.STAFF(restaurantId));
};

export const getRestaurantRoom = SOCKET_ROOMS.RESTAURANT;
export const getStaffRoom = SOCKET_ROOMS.STAFF;
export const getCustomerRoom = SOCKET_ROOMS.CUSTOMER;

export default { joinRestaurantRoom, joinStaffRoom, joinCustomerRoom };
