import * as restaurantService from '../services/restaurant.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getAllRestaurants = asyncHandler(async (req, res) => {
  const result = await restaurantService.getAllRestaurants();
  ApiResponse.success(res, 'Restaurants fetched successfully', result);
});

export const getMyRestaurant = asyncHandler(async (req, res) => {
  const result = await restaurantService.getMyRestaurant(req.user._id);
  ApiResponse.success(res, 'Restaurant fetched successfully', result);
});

export const getRestaurantById = asyncHandler(async (req, res) => {
  const result = await restaurantService.getRestaurantById(req.params.id);
  ApiResponse.success(res, 'Restaurant fetched successfully', result);
});

export const createRestaurant = asyncHandler(async (req, res) => {
  const result = await restaurantService.createRestaurant({
    ...req.body,
    ownerId: req.user._id,
  });
  ApiResponse.created(res, 'Restaurant created successfully', result);
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const result = await restaurantService.updateRestaurant(
    req.params.id,
    req.body,
    req.user._id
  );
  ApiResponse.success(res, 'Restaurant updated successfully', result);
});

export default {
  getAllRestaurants,
  getMyRestaurant,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
};
