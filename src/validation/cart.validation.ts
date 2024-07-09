import joi from 'joi';

export const createCartValidation = joi.object({
  book_id: joi.string().required(),
  quantity: joi.number().required(),
});
