import { NextFunction, Request, Response } from "express";
import {
	BadrequestError,
	InternalServerError,
	UnauthorizedError,
} from "./error";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import { Token, User } from "../prisma/db";

/**
 * Middleware function to check authentication.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call.
 */
const CheckAuthentication = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {
		headers: { api_key },
	} = req;

	if (api_key) {
		const token = await Token.findUnique({
			where: {
				token: api_key as string,
			},
			select: {
				user: true,
			},
		});

		if (!token) throw new BadrequestError("Invalid api_key provided.");
		(req as any).user = token.user;
		return next();
	}

	const token = req.headers["authorization"];
	if (!token || !token.startsWith("Bearer "))
		throw new BadrequestError("Unathenticated");
	let parsed_token = token.split(" ")[1];
	const { email } = jwt.verify(parsed_token, config.JWT_SECERET) as any;
	if (!email) throw new BadrequestError("Invalid Token");

	const user = await User.findUnique({
		where: {
			email,
		},
	});

	(req as any).user = user;

	next();
};

/**
 * Middleware function to authenticate requests.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to call.
 */

export const Authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await CheckAuthentication(req, res, next);
	} catch (error: any) {
		next();
	}
};

/**
 * Middleware function that checks if the request is authenticated.
 * If the request is authenticated, it calls the next middleware function.
 * If the request is not authenticated or the authentication token has expired,
 * it throws an error and calls the appropriate error handler middleware.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function.
 */
export const AuthenticatedOnly = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await CheckAuthentication(req, res, next);
	} catch (error: any) {
		if (error instanceof TokenExpiredError)
			next(new UnauthorizedError("Token Exipred"));
		next(new UnauthorizedError(error.message));
	}
};
