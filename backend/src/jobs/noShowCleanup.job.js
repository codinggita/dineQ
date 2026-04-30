import cron from 'node-cron';
import { Queue, Restaurant } from '../models/index.js';
import { getIO } from '../socket/index.js';
import { SOCKET_EVENTS } from '../socket/socketEvents.js';

const NO_SHOW_THRESHOLD_MINUTES = 30;

export const startNoShowCleanupJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const threshold = new Date(
        Date.now() - NO_SHOW_THRESHOLD_MINUTES * 60 * 1000
      );

      const staleEntries = await Queue.find({
        status: 'waiting',
        joinedAt: { $lt: threshold },
      });

      for (const entry of staleEntries) {
        entry.status = 'no_show';
        await entry.save();

        const queue = await Queue.find({
          restaurant: entry.restaurant,
          status: 'waiting',
        }).sort({ position: 1 });

        for (let i = 0; i < queue.length; i++) {
          queue[i].position = i + 1;
          await queue[i].save();
        }

        const restaurantId = entry.restaurant.toString();
        const io = getIO();
        if (io) {
          io.to(`restaurant:${restaurantId}`).emit(
            SOCKET_EVENTS.QUEUE_UPDATED,
            {
              queue: queue.map((q) => ({
                id: q._id,
                position: q.position,
                partySize: q.partySize,
              })),
            }
          );
        }

        console.log(`Marked queue entry ${entry._id} as no-show`);
      }
    } catch (error) {
      console.error('No-show cleanup error:', error);
    }
  });

  console.log('No-show cleanup job started (every 5 minutes)');
};

export default { startNoShowCleanupJob };
