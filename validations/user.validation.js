const Joi = require("joi");

const validateRegisterUser = (data) => {
  const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().number().required(),
    password: Joi.string().min(6).required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip_code: Joi.string().required(),
    country: Joi.string().required(),
  });
  return createUserSchema.validate(data);
};

module.exports = validateRegisterUser;
