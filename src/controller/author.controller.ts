import { RequestHandler, request, response } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import { Author } from '../models/author.model';
import { createAuthorValidation } from '../validation/author.validation';

export const createAuthor: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createAuthorValidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, {
        message: errorDetails,
      });
    }
    const data = await Author.create(body);
    return Ok(response, 'author created successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getAllAuthor: RequestHandler = async (request, response) => {
  try {
    let author_name = request.params.search;
    const query: any = {};
    if (author_name) {
      query.author_name = { $regex: author_name, $options: 'i' };
    }
    const data = await Author.find(query);
    return Ok(response, 'all author fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const updatePublisher: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let authorId = body.authorId;
    let author = await Author.findOne({ _id: authorId });
    if (!author) {
      return response.status(401).json({ message: 'author not found' });
    }
    const data = await Author.findByIdAndUpdate(authorId, body, { new: true });
    return Ok(response, 'data updated successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const deleteauthor: RequestHandler = async (request, response) => {
  try {
    let authorId = request.body.authorId;
    let author = await Author.findOne({ _id: authorId });
    if (!author) {
      return response.status(401).json({ message: 'author not found' });
    }
    const data = await Author.findByIdAndDelete(authorId);
    return Ok(response, 'data deete successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
