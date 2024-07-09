import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import { createCartValidation } from '../validation/cart.validation';
import { Cart } from '../models/cart.model';
import { Book } from '../models/books.model';

export const addToCart: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let userId = request.udata.id;
    let { error } = createCartValidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, { message: errorDetails });
    }
    const cart: any = await Cart.findOne({ user_id: userId });
    if (cart) {
      let existAlready = await cart.books.find((item: any) => {
        return item.book_id.equals(body.book_id);
      });
      if (existAlready) {
        existAlready.quantity = existAlready.quantity + body.quantity;
        existAlready.sub_total = existAlready.quantity * existAlready.price;
        cart.totalPrice = cart.books.reduce(
          (total: number, book: any) => total + book.sub_total,
          0
        );
        await cart.save();
        return Ok(response, 'product added into cart successfully...', cart);
      } else {
        const book: any = await Book.findOne({ _id: body.book_id });
        let subtotal = book.price * body.quantity;
        cart.books.push({
          book_id: book._id,
          quantity: body.quantity,
          price: book.price,
          sub_total: subtotal,
        });
        cart.totalPrice += subtotal;
        await cart.save();
        return Ok(response, 'product asdded into cart successfully...;;', cart);
      }
    } else {
      const book: any = await Book.findOne({ _id: body.book_id });
      let subtotal = (await book.price) * body.quantity;
      let payload = {
        user_id: userId,
        books: [
          {
            book_id: book._id,
            quantity: body.quantity,
            price: book.price,
            sub_total: subtotal,
          },
        ],
        totalPrice: subtotal,
      };
      const data = await Cart.create(payload);
      return Ok(response, 'product added into cart successfully', data);
    }
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const viewCart: RequestHandler = async (request, response) => {
  try {
    let userId = request.udata.id;

    const data = await Cart.findOne({ user_id: userId }).populate(
      'books.book_id',
      'title author'
    );
    if (!data) {
      return response.status(404).json({ message: 'cart not found' });
    }

    if (data.books.length <= 0) {
      return response.status(400).json({ message: 'cart is empty !' });
    }
    return Ok(response, 'cart fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const removeProductFromCart: RequestHandler = async (
  request,
  response
) => {
  try {
    let userId = request.udata.id;
    let { book_id } = request.body;
    const cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return BadRequest(response, { message: 'Cart not found for the user' });
    }

    const bookIndex = cart.books.findIndex((item: any) =>
      item.book_id.equals(book_id)
    );
    if (bookIndex === -1) {
      return BadRequest(response, { message: 'Book not found in cart' });
    }

    const [removedBook] = cart.books.splice(bookIndex, 1);
    cart.totalPrice -= removedBook.sub_total;

    await cart.save();

    return Ok(response, 'Product removed from cart successfully', cart);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const removeCart: RequestHandler = async (request, response) => {
  try {
    let userId = request.udata.id;
    const cart = await Cart.findOneAndDelete({ user_id: userId });
    if (!cart) {
      return BadRequest(response, { message: 'Cart not found for the user' });
    }
    return Ok(response, 'Cart removed successfully', {});
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
