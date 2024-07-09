import joi from 'joi';

export const createCategoryValidation = joi.object({
  name: joi.string().required(),
  description: joi.string().required(),
});
