import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import {
  createInventoryValidation,
  addStockvalidation,
} from '../validation/inventory.validation';
import { Inventory } from '../models/inventory.model';

export const createInventory: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createInventoryValidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, { message: errorDetails });
    }
    let { book_id, stock, address, city, state } = body;

    let payload = {
      book_id: book_id,
      stock: stock,
      stock_address: {
        address: address,
        city: city,
        state: state,
      },
    };
    const data = await Inventory.create(payload);
    return Ok(response, 'inventory create successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const getallInventory: RequestHandler = async (request, response) => {
  try {
    const data = await Inventory.find();
    return Ok(response, 'data fetched successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const addStock: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = addStockvalidation.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, { message: errorDetails });
    }
    let inventory = await Inventory.findOne({ _id: body.inventory_id });
    if (!inventory) {
      return BadRequest(response, { message: 'product not found !' });
    }
    inventory.stock += body.stock;
    inventory.save();
    return Ok(response, 'add stock successfully', inventory);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
