import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    image: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine type is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    avgSeatingTimeMinutes: {
      type: Number,
      default: 15,
      min: [5, 'Average seating time must be at least 5 minutes'],
    },
    menu: [menuItemSchema],
    isOpen: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ name: 'text', address: 'text', cuisine: 'text' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
