import { RequestHandler, request, response } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import { createPublisherValidation } from '../validation/publisher.validation';
import { Publisher } from '../models/publisher.model';

export const createPublisher: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createPublisherValidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, {
        message: errorDetails,
      });
    }
    const data = await Publisher.create(body);
    return Ok(response, 'publisher created successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getAllPublisher: RequestHandler = async (request, response) => {
  try {
    let name = request.params.search;
    const query: any = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    const data = await Publisher.find(query);
    return Ok(response, 'all publisher fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const updatePublisher: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let publisherId = body.publisherId;
    let publisher = await Publisher.findOne({ _id: publisherId });
    if (!publisher) {
      return response.status(401).json({ message: 'publisher not found' });
    }
    const data = await Publisher.findByIdAndUpdate(publisherId, body, {
      new: true,
    });
    return Ok(response, 'data updated successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const deletePublisher: RequestHandler = async (request, response) => {
  try {
    let publisherId = request.body.publisherId;
    let publisher = await Publisher.findOne({ _id: publisherId });
    if (!publisher) {
      return response.status(401).json({ message: 'publisher not found' });
    }
    const data = await Publisher.findByIdAndDelete(publisherId);
    return Ok(response, 'data updated successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
