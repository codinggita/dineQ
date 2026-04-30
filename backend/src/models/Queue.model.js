import mongoose from 'mongoose';

const queueSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'Restaurant is required'],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    position: {
      type: Number,
      required: [true, 'Position is required'],
      min: [1, 'Position must be at least 1'],
    },
    partySize: {
      type: Number,
      required: [true, 'Party size is required'],
      default: 1,
      min: [1, 'Party size must be at least 1'],
      max: [20, 'Party size cannot exceed 20'],
    },
    status: {
      type: String,
      enum: ['waiting', 'seated', 'no_show', 'left', 'removed_by_owner'],
      default: 'waiting',
    },
    socketId: {
      type: String,
    },
    estimatedWaitMinutes: {
      type: Number,
      default: 0,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    preOrders: [
      {
        name: String,
        price: Number,
        category: String,
        image: String,
        quantity: { type: Number, default: 1 },
      },
    ],
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

queueSchema.index({ restaurant: 1, status: 1, position: 1 });
queueSchema.index({ customer: 1, status: 1 });
queueSchema.index({ createdAt: -1 });

const Queue = mongoose.model('Queue', queueSchema);
export default Queue;
