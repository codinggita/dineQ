import { Restaurant, Queue } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import calculateWaitTime from '../utils/calculateWaitTime.js';

export const getMyRestaurant = async (ownerId) => {
  const restaurant = await Restaurant.findOne({ owner: ownerId });
  if (!restaurant) {
    throw ApiError.notFound('Restaurant not found');
  }

  const queueCount = await Queue.countDocuments({
    restaurant: restaurant._id,
    status: 'waiting',
  });

  return {
    id: restaurant._id,
    name: restaurant.name,
    address: restaurant.address,
    cuisine: restaurant.cuisine,
    image: restaurant.image,
    avgSeatingTimeMinutes: restaurant.avgSeatingTimeMinutes,
    isOpen: restaurant.isOpen,
    menu: restaurant.menu,
    queueCount,
    avgWaitTime: calculateWaitTime(
      queueCount,
      restaurant.avgSeatingTimeMinutes
    ),
  };
};

export const getAllRestaurants = async () => {
  const restaurants = await Restaurant.find({ isOpen: true }).sort({ name: 1 });

  const restaurantsWithQueue = await Promise.all(
    restaurants.map(async (restaurant) => {
      const queueCount = await Queue.countDocuments({
        restaurant: restaurant._id,
        status: 'waiting',
      });

      return {
        id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address,
        cuisine: restaurant.cuisine,
        image: restaurant.image,
        avgSeatingTimeMinutes: restaurant.avgSeatingTimeMinutes,
        isOpen: restaurant.isOpen,
        queueCount,
        avgWaitTime: calculateWaitTime(
          queueCount,
          restaurant.avgSeatingTimeMinutes
        ),
        menu: restaurant.menu,
      };
    })
  );

  return restaurantsWithQueue;
};

export const getRestaurantById = async (restaurantId) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw ApiError.notFound('Restaurant not found');
  }

  const queueCount = await Queue.countDocuments({
    restaurant: restaurant._id,
    status: 'waiting',
  });

  return {
    id: restaurant._id,
    name: restaurant.name,
    address: restaurant.address,
    cuisine: restaurant.cuisine,
    image: restaurant.image,
    avgSeatingTimeMinutes: restaurant.avgSeatingTimeMinutes,
    menu: restaurant.menu,
    isOpen: restaurant.isOpen,
    owner: restaurant.owner,
    queueCount,
    avgWaitTime: calculateWaitTime(
      queueCount,
      restaurant.avgSeatingTimeMinutes
    ),
    createdAt: restaurant.createdAt,
  };
};

export const createRestaurant = async ({
  name,
  address,
  cuisine,
  avgSeatingTimeMinutes,
  menu,
  ownerId,
}) => {
  const restaurant = await Restaurant.create({
    name,
    address,
    cuisine,
    avgSeatingTimeMinutes: avgSeatingTimeMinutes || 15,
    menu: menu || [],
    owner: ownerId,
  });

  return {
    id: restaurant._id,
    name: restaurant.name,
    address: restaurant.address,
    cuisine: restaurant.cuisine,
    image: restaurant.image,
    avgSeatingTimeMinutes: restaurant.avgSeatingTimeMinutes,
    menu: restaurant.menu,
    isOpen: restaurant.isOpen,
  };
};

export const updateRestaurant = async (restaurantId, updates, ownerId) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw ApiError.notFound('Restaurant not found');
  }

  if (restaurant.owner.toString() !== String(ownerId)) {
    throw ApiError.forbidden('You can only update your own restaurant');
  }

  const allowedUpdates = [
    'name',
    'address',
    'cuisine',
    'image',
    'avgSeatingTimeMinutes',
    'menu',
    'isOpen',
  ];
  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) {
      restaurant[field] = updates[field];
    }
  });

  await restaurant.save();

  return {
    id: restaurant._id,
    name: restaurant.name,
    address: restaurant.address,
    cuisine: restaurant.cuisine,
    avgSeatingTimeMinutes: restaurant.avgSeatingTimeMinutes,
    menu: restaurant.menu,
    isOpen: restaurant.isOpen,
  };
};

export default {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
};
