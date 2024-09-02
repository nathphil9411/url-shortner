import Joi from "joi";

export const CreateURLSchema = Joi.object({
	short_url: Joi.string().min(4).max(8).optional(),
	long_url: Joi.string().uri().required(),
	expiration_date: Joi.date().iso().optional(),
});

export const UpdateURLSchema = Joi.object({
	short_url: Joi.string().min(4).max(8).optional(),
	long_url: Joi.string().uri().optional(),
});
