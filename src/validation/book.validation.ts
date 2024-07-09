import joi, { defaults } from 'joi';

export const createBookValidation = joi.object({
  title: joi.string().required(),
  author: joi.string().required(),
  isbn: joi.string().required(),
  description: joi.string(),
  price: joi.number().required(),
  defaults: joi.string(),
  category: joi.string().required(),
  publisher: joi.string().required(),
  publication_date: joi.string().required(),
  stock: joi.number().required(),
});
