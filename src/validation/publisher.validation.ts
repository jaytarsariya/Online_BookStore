import joi from 'joi';

export const createPublisherValidation = joi.object({
  name: joi.string().required(),
  address: joi.string().required(),
});
