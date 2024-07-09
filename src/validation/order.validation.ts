import Joi from 'joi';

const orderItemSchema = Joi.object({
  product_id: Joi.string().required(),
  quantity: Joi.number().required(),
  //   // price: Joi.number().required(),
});

// const paymentInfoSchema = Joi.object({
//   payment_method: Joi.string().required(),
//   // payment_status: Joi.string().valid('pending', 'complated', 'failed').default('pending'),
//   transaction_id: Joi.string().required(),
//   amount: Joi.number().min(0).required(),
//   currency: Joi.string().required(),
//   // payment_date: Joi.date().default(() => new Date()),
// });

export const createOrderValidationSchema = Joi.object({
  // user_id: Joi.string().hex().length(24).required(),
  orderItem: Joi.array().items(orderItemSchema).required(),
  // total_amount: Joi.number().min(0).required(),
  // order_date: Joi.date().default(() => new Date()),
  order_status: Joi.string()
    .valid('pending', 'shipped', 'delivered', 'cancelled')
    .default('pending'),
  shipping_address: Joi.object().required(),
  payment_info: Joi.object({
    payment_method: Joi.string().required(),
    // payment_status: Joi.string().valid('pending', 'complated', 'failed').default('pending'),
    // transaction_id: Joi.string().required(),
    // amount: Joi.number().min(0).required(),
    currency: Joi.string().required(),
    // payment_date: Joi.date().default(() => new Date()),
  }).required(),
});
