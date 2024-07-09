import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import { createOrderValidationSchema } from '../validation/order.validation';
import { StockLocation } from '../models/location.model';
import { Order } from '../models/order.model';
import { Book } from '../models/books.model';

export const createOrder: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createOrderValidationSchema.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, { message: errorDetails });
    }

    let totalPrice = 0;
    let totalAmount = 0;
    let order_Items = [];
    for (let product of body.orderItem) {
      const data: any = await StockLocation.findOne({
        product_id: product.product_id,
        pin_code: body.shipping_address.pin_code,
      }).populate('product_id');

      if (!data) {
        return response.status(400).json({
          message: `Product with ID ${product.product_id} is not found in stock at the specified location`,
        });
      }

      if (data.product_id.stock >= product.quantity) {
        const productTotalPrice = data.product_id.price * product.quantity;
        totalPrice += productTotalPrice;
        totalAmount += totalPrice;
        order_Items.push({
          product_id: product.product_id,
          quantity: product.quantity,
          price: data.product_id.price,
          total_price: productTotalPrice,
        });
      } else {
        return response.status(400).json({
          message: `${data.product_id?.title} is not available in sufficient stock`,
        });
      }
    }

    if (order_Items.length === 0) {
      return response
        .status(400)
        .json({ message: 'No valid order items found to create the order' });
    }
    let payload = {
      user_id: request.udata.id,
      orderItem: order_Items,
      total_amount: totalAmount,
      shipping_address: {
        contact_number: body.shipping_address.contact_number,
        name: body.shipping_address.name,
        address_line1: body.shipping_address.address_line1,
        landmark: body.shipping_address.landmark,
        address_line2: body.shipping_address.address_line2,
        city: body.shipping_address.city,
        state: body.shipping_address.state,
        country: body.shipping_address.country,
        pin_code: body.shipping_address.pin_code,
      },
      payment_info: {
        payment_method: 'COD',
        transaction_id: 'razorpaypayment_123',
        currency: 'INR',
      },
    };
    for (let book of order_Items) {
      Book.findByIdAndUpdate(book.product_id, {
        $inc: { stock: -book.quantity },
      });
    }
    const data = await Order.create(payload);
    return Ok(response, 'order created successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
