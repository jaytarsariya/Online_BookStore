import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import {
  createUserValidation,
  loginUserValidation,
} from '../validation/user.validation';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const config = require('../config/config')['development'];

export const createUser: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createUserValidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, {
        message: errorDetails,
      });
    }
    const existingUser = await User.findOne({
      $or: [{ email: body.email }, { 'profile.phone': body.profile?.phone }],
    });
    if (existingUser) {
      return response.status(400).json({ message: 'user already exists !' });
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    let payload = {
      username: body.username,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      profile: {
        address: body.profile?.address,
        phone: body.profile?.phone,
      },
    };
    const data = await User.create(payload);
    return Ok(response, 'user created successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const loginUser: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = loginUserValidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, {
        message: errorDetails,
      });
    }
    const user = await User.findOne({
      $or: [{ email: body.email }, { 'profile.phone': body.phone }],
    });
    if (!user) {
      return response.status(401).json({ message: 'user not found !' });
    }
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      return response.status(400).json({ message: 'Invelid credentials !' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwt_secret,
      { expiresIn: '7d' }
    );
    response.cookie('token', token);
    return Ok(response, `${user.role} is login successfully !`, token);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getAllUsers: RequestHandler = async (request, response) => {
  try {
    let user = await User.find({ is_deleted: false });
    if (!user) {
      return response.status(401).json({ message: 'User not found' });
    }
    return Ok(response, 'all users fetched successfully', user);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const updateUser: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let userId = body.userId;
    let userExist = await User.findOne({ _id: userId });
    if (!userExist) {
      return response.status(401).json({ message: 'User not found' });
    }
    const data = await User.findByIdAndUpdate(userId, body, { new: true });
    return Ok(response, 'data updated successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const deleteUser: RequestHandler = async (request, response) => {
  try {
    let userId = request.body.userId;
    let userExist = await User.findOne({ _id: userId });
    if (!userExist) {
      return response.status(401).json({ message: 'User not found' });
    }
    const data = await User.findByIdAndUpdate(
      userId,
      { is_deleted: true },
      { new: true }
    );
    return Ok(response, `${userExist.role} is deleted successfully`, data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
