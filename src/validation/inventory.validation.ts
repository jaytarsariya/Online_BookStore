import joi from 'joi';

export const createInventoryValidation = joi.object({
  book_id: joi.string().required(),
  stock: joi.number().required(),
  address: joi.string().required(),
  city: joi.string().required(),
  state: joi.string().required(),
});

export const addStockvalidation = joi.object({
  inventory_id: joi.string().required(),
  // book_id: joi.string().required(),
  stock: joi.number().required(),
  // address: joi.string().required(),
  // city: joi.string().required(),
  // state: joi.string().required(),
});
