import joi from 'joi';

export const createLocationSchema = joi.object({
  product_id: joi.string().required(),
  contact_number: joi
    .string()
    .required()
    .regex(/^[0-9]{10}$/)
    .messages({ 'string.pattern.base': 'contact_number must have 10 digits.' }),
  name: joi.string().required(),
  address_line1: joi.string(),
  landmark: joi.string().required(),
  address_line2: joi.string(),
  city: joi.string().required(),
  state: joi.string().required(),
  country: joi.string().required(),
  pin_code: joi.string(),
  location: joi.object({
    longitude: joi.string().required(),
    latitude: joi.string().required(),
  }),
});
