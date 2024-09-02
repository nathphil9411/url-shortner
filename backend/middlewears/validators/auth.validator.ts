import Joi from "joi";

export const AuthSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"string.empty": "Email is required",
		"string.email": "Email must be a valid email address",
	}),
	password: Joi.string().min(3).required().messages({
		"string.empty": "Password is required",
		"string.min": "Password must be at least 3 characters long",
	}),
});
