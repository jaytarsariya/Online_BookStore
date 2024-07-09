import joi from 'joi';

export const createUserValidation = joi.object({
  username: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  role: joi.string(),
  profile: joi.object({
    address: joi.string(),
    phone: joi
      .string()
      .required()
      .regex(/^[0-9]{10}$/)
      .messages({ 'string.pattern.base': `phone number must have 10 digits` }),
  }),
});

export const loginUserValidation = joi.object({
  phone: joi
    .string()
    .regex(/^[0-9]{10}$/)
    .messages({ 'string.pattern.base': `phone number must have 10 digits` }),
  email: joi.string(),
  password: joi.string().required(),
});
