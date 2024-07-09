import { RequestHandler, request, response } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import { Book } from '../models/books.model';
import { createBookValidation } from '../validation/book.validation';
import { Author } from '../models/author.model';
import { Category } from '../models/category.model';
import { Publisher } from '../models/publisher.model';

export const createBook: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let sellerid = request.udata.id;
    let { error } = createBookValidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, {
        message: errorDetails,
      });
    }
    let payload = {
      title: body.title,
      author: body.author,
      isbn: body.isbn,
      price: body.price,
      defaults: body.defaults,
      category: body.category,
      publisher: body.publisher,
      seller: sellerid,
      publication_date: body.publication_date,
      // stock: body.stock,
      cover_img: request.file?.filename,
    };
    const data = await Book.create(payload);
    return Ok(response, 'data created successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getAllBookDetails: RequestHandler = async (request, response) => {
  try {
    const books = await Book.find()
      .select('title price cover_img')
      .populate('category', 'name');

    const responsePayload = books.map((book) => ({
      title: book.title,
      price: book.price,
      category: (book.category as any).name,
      cover_img: book.cover_img,
    }));
    return Ok(response, 'data created successfully', responsePayload);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const viewAllbooks: RequestHandler = async (request, response) => {
  try {
    const data = await Book.find();
    return Ok(response, 'data fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const searchBooks: RequestHandler = async (request, response) => {
  try {
    const { title, author_name, category, publisher_name } = request.body;
    let searchCriteria: any = {};

    if (title) {
      searchCriteria.title = { $regex: title, $options: 'i' }; // Case-insensitive regex search
    } else if (author_name) {
      console.log('auhtor...');

      const authors = await Author.find({
        author_name: { $regex: author_name, $options: 'i' },
      }).select('_id');
      searchCriteria.author = { $in: authors.map((author) => author._id) };
    } else if (category) {
      console.log('category...');

      const categories = await Category.find({
        name: { $regex: category, $options: 'i' },
      }).select('_id');
      searchCriteria.category = {
        $in: categories.map((category) => category._id),
      };
    } else if (publisher_name) {
      console.log('publisher_name...');

      const publishers = await Publisher.find({
        name: { $regex: publisher_name, $options: 'i' },
      }).select('_id');
      searchCriteria.publisher = {
        $in: publishers.map((publisher) => publisher._id),
      };
    }
    const books = await Book.find(searchCriteria)
      .populate('author', 'author_name')
      .populate('category', 'name')
      .populate('publisher', 'name');
    return Ok(response, 'Books fetched successfully', books);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const updateBook: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let bookId = request.query.bookId;
    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return response.status(404).json({ message: 'book not found !' });
    }
    if (book.seller?.toString() !== request.udata.id) {
      return response.status(401).json({ message: 'You are not authorized !' });
    }
    const updatedData = await Book.findByIdAndUpdate(
      book._id,
      { $set: body },
      { new: true }
    );
    return Ok(response, 'data updated successfully', updatedData);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const deleteBook: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    const book = await Book.findOne({ _id: body.bookId });
    if (!book) {
      return response.status(404).json({ message: 'book not found !' });
    }
    if (book.seller?.toString() !== request.udata.id) {
      return response.status(401).json({ message: 'You are not authorized !' });
    }
    const updatedData = await Book.findByIdAndDelete(book._id);
    return Ok(response, 'data updated successfully', updatedData);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
