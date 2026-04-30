export const SOCKET_EVENTS = {
  JOIN_QUEUE: 'join_queue',
  QUEUE_UPDATED: 'queue_updated',
  TABLE_READY: 'table_ready',
  PREORDER_RECEIVED: 'preorder_received',
  NO_SHOW: 'no_show',
  WAIT_TIME_UPDATE: 'wait_time_update',
  CUSTOMER_JOINED: 'customer_joined',
  CUSTOMER_SEATED: 'customer_seated',
  CUSTOMER_LEFT: 'customer_left',
  ORDER_STATUS_UPDATED: 'order_status_updated',
  ERROR: 'socket_error',
};

export const SOCKET_ROOMS = {
  RESTAURANT: (id) => `restaurant:${id}`,
  STAFF: (id) => `staff:${id}`,
  CUSTOMER: (id) => `customer:${id}`,
};

export default SOCKET_EVENTS;
