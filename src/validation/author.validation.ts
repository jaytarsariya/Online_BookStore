import joi from 'joi';

export const createAuthorValidation = joi.object({
  author_name: joi.string().required(),
  biography: joi.string().required(),
  birth_date: joi.date().required(),
});
