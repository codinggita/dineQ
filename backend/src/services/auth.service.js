import { User, Restaurant } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { generateToken } from '../utils/generateToken.js';
import fs from 'fs';
import path from 'path';

export const registerUser = async ({
  name,
  email,
  password,
  role = 'customer',
  restaurant = null,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  let createdRestaurant = null;
  if (role === 'staff' && restaurant) {
    createdRestaurant = await Restaurant.create({
      name: restaurant.name,
      address: restaurant.address,
      cuisine: restaurant.cuisine,
      image: restaurant.image || '',
      avgSeatingTimeMinutes: restaurant.avgSeatingTimeMinutes || 15,
      menu: restaurant.menu || [],
      owner: user._id,
    });
  }

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    restaurant: createdRestaurant
      ? {
          id: createdRestaurant._id,
          name: createdRestaurant.name,
          image: createdRestaurant.image,
        }
      : null,
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (updates.name) user.name = updates.name;
  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const updateUserAvatar = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  if (user.avatar) {
    try {
      const oldPath = path.join(
        process.cwd(),
        'uploads',
        user.avatar.replace('/uploads/', '')
      );
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    } catch (err) {
      console.error('Failed to delete old avatar:', err.message);
    }
  }

  const avatarUrl = `/uploads/${file.filename}`;
  user.avatar = avatarUrl;
  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
};
