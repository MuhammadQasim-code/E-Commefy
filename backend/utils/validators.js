const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must not exceed 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+])[A-Za-z\d@$!%*?&#^()\-_=+]{8,}$/)
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base': 'Phone must be between 10 and 15 digits',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    'string.min': 'Product name must be at least 2 characters',
    'string.max': 'Product name must not exceed 200 characters',
    'any.required': 'Product name is required',
  }),
  description: Joi.string().trim().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters',
    'any.required': 'Description is required',
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required',
  }),
  discountPrice: Joi.number().min(0).optional().default(0).messages({
    'number.min': 'Discount price cannot be negative',
  }),
  category: Joi.string().required().messages({
    'any.required': 'Category is required',
  }),
  stock: Joi.number().integer().min(0).optional().default(0).messages({
    'number.min': 'Stock cannot be negative',
    'number.integer': 'Stock must be an integer',
  }),
  brand: Joi.string().trim().optional().allow(''),
  isFeatured: Joi.boolean().optional().default(false),
  tags: Joi.alternatives()
    .try(Joi.array().items(Joi.string().trim()), Joi.string().trim())
    .optional(),
});

const categorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Category name must be at least 2 characters',
    'string.max': 'Category name must not exceed 100 characters',
    'any.required': 'Category name is required',
  }),
  description: Joi.string().trim().optional().allow(''),
});

const checkoutSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'any.required': 'Full name is required',
  }),
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
  }),
  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be between 10 and 15 digits',
      'any.required': 'Phone is required',
    }),
  country: Joi.string().trim().required().messages({
    'any.required': 'Country is required',
  }),
  state: Joi.string().trim().required().messages({
    'any.required': 'State is required',
  }),
  city: Joi.string().trim().required().messages({
    'any.required': 'City is required',
  }),
  postalCode: Joi.string().trim().required().messages({
    'any.required': 'Postal code is required',
  }),
  address: Joi.string().trim().required().messages({
    'any.required': 'Address is required',
  }),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: Pending, Confirmed, Shipped, Delivered, Cancelled',
      'any.required': 'Status is required',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  categorySchema,
  checkoutSchema,
  updateOrderStatusSchema,
};
