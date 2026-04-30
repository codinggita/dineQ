import * as authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  ApiResponse.created(res, 'User registered successfully', result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  ApiResponse.success(res, 'Login successful', result);
});

export const logout = asyncHandler(async (req, res) => {
  ApiResponse.success(res, 'Logout successful', null);
});

export const getProfile = asyncHandler(async (req, res) => {
  const result = await authService.getUserProfile(req.user._id);
  ApiResponse.success(res, 'Profile fetched successfully', result);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const result = await authService.updateUserProfile(req.user._id, req.body);
  ApiResponse.success(res, 'Profile updated successfully', result);
});

export default { register, login, logout, getProfile, updateProfile };
