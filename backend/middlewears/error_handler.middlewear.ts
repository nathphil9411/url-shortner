import { NextFunction, Request, Response } from "express";
import config from "../config";
import ErrorParent, { ValidationError } from "./error";
import { StatusCodes } from "http-status-codes";

const ErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof ValidationError)
		return res
			.status(StatusCodes.UNPROCESSABLE_ENTITY)
			.json({ errors: err.errors });

	if (err instanceof ErrorParent)
		return res.status(err.code).json({
			message: err.message,
			stack: config.NODE_ENV === "development" ? err.stack : null,
		});
	else
		return res.status(500).json({
			message: err.message,
			stack: config.NODE_ENV === "development" ? err.stack : null,
		});
};

export default ErrorHandler;
