import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    queue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Queue',
      required: [true, 'Queue entry is required'],
    },
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
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'served'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ queue: 1 });
orderSchema.index({ restaurant: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
