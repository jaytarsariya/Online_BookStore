import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import { createCategoryValidation } from '../validation/category.validation';
import { Category } from '../models/category.model';

export const createCategory: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createCategoryValidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, {
        message: errorDetails,
      });
    }
    const category = await Category.create(body);
    return Ok(response, 'category created successfully', category);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getAllCategory: RequestHandler = async (request, response) => {
  try {
    let name = request.params.search;
    const query: any = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    const data = await Category.find(query);
    return Ok(response, 'all category fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const updateCategory: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let catId = body.catId;
    let category = await Category.findOne({ _id: catId });
    if (!category) {
      return response.status(401).json({ message: 'category not found' });
    }
    const data = await Category.findByIdAndUpdate(catId, body, { new: true });
    return Ok(response, 'data updated successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const deleteCategory: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let catId = body.catId;
    let category = await Category.findOne({ _id: catId });
    if (!category) {
      return response.status(401).json({ message: 'category not found' });
    }
    const data = await Category.findByIdAndDelete(catId);
    return Ok(response, 'category deleted successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
