import { RequestHandler, response } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import { StockLocation } from '../models/location.model';
import { createLocationSchema } from '../validation/location.validation';

export const createLocation: RequestHandler = async (request, response) => {
  try {
    let body = request.body;
    let { error } = createLocationSchema.validate(body);
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return BadRequest(response, { message: errorDetails });
    }
    const notReturnAddSame = await StockLocation.findOne({
      $and: [
        { product_id: body.product_id },
        { contact_number: body.contact_number },
      ],
    });
    if (notReturnAddSame) {
      return response
        .status(400)
        .json({ message: 'contact number already exist on this product !' });
    }
    let payload = {
      product_id: body.product_id,
      contact_number: body.contact_number,
      name: body.name,
      address_line1: body.address_line1,
      landmark: body.landmark,
      address_line2: body.address_line2,
      city: body.city,
      state: body.state,
      country: body.country,
      pin_code: body.pin_code,
      location: {
        longitude: body.location.longitude,
        latitude: body.location.latitude,
      },
    };
    const data = await StockLocation.create(payload);
    return Ok(response, 'location created successfully', data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
