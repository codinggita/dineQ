import cron from 'node-cron';
import { Queue, Restaurant } from '../models/index.js';
import { getIO } from '../socket/index.js';
import { SOCKET_EVENTS } from '../socket/socketEvents.js';
import calculateWaitTime from '../utils/calculateWaitTime.js';

export const startWaitTimeRecalculatorJob = () => {
  cron.schedule('*/2 * * * *', async () => {
    try {
      const restaurants = await Restaurant.find({ isOpen: true });

      for (const restaurant of restaurants) {
        const waitQueue = await Queue.find({
          restaurant: restaurant._id,
          status: 'waiting',
        }).sort({ position: 1 });

        for (const entry of waitQueue) {
          const newWaitTime = calculateWaitTime(
            entry.position,
            restaurant.avgSeatingTimeMinutes
          );
          if (entry.estimatedWaitMinutes !== newWaitTime) {
            entry.estimatedWaitMinutes = newWaitTime;
            await entry.save();
          }
        }

        const restaurantId = restaurant._id.toString();
        const io = getIO();
        if (io) {
          const avgWaitTime = calculateWaitTime(
            waitQueue.length,
            restaurant.avgSeatingTimeMinutes
          );

          io.to(`restaurant:${restaurantId}`).emit(
            SOCKET_EVENTS.WAIT_TIME_UPDATE,
            {
              restaurantId,
              newWaitTime: avgWaitTime,
              queueLength: waitQueue.length,
            }
          );
        }
      }

      console.log('Wait time recalculation completed');
    } catch (error) {
      console.error('Wait time recalculation error:', error);
    }
  });

  console.log('Wait time recalculator job started (every 2 minutes)');
};

export default { startWaitTimeRecalculatorJob };
