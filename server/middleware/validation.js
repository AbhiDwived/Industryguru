const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  maincategory: Joi.string().required(),
  subcategory: Joi.string().required(),
  brand: Joi.string().required(),
  baseprice: Joi.number().positive().required(),
  discount: Joi.number().min(0).max(100),
  finalprice: Joi.number().positive().required(),
  stock: Joi.number().min(0).required(),
  description: Joi.string().max(1000),
  specification: Joi.string().optional()
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      result: 'Fail',
      message: error.details[0].message
    });
  }
  next();
};

module.exports = { validateProduct };