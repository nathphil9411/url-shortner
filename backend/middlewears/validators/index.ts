import Joi from "joi";
import { ValidationError } from "../error";

const validator = (schema: Joi.ObjectSchema<any>, data: any) => {
	const { error } = schema.validate(data, { abortEarly: false });

	if (error) {
		const formattedErrors = error.details.map((detail) => ({
			field: detail.path.join("."),
			message: detail.message.replace(/['"]/g, ""),
		}));

		throw new ValidationError(formattedErrors);
	}
	return 0;
};

export default validator;
