import { Request, Response } from "express";
import authService from "../services/auth.service";
import Wrapper from "../middlewears/wrapper";
import validator from "../middlewears/validators";
import { AuthSchema } from "../middlewears/validators/auth.validator";
import { StatusCodes } from "http-status-codes";

class AuthController {
	public login = Wrapper(async (req: Request, res: Response) => {
		validator(AuthSchema, req.body);
		const {
			body: { email, password },
		} = req;
		const user = await authService.login(email, password);
		return res.status(StatusCodes.OK).json({
			message: "Login successful",
			data: user,
		});
	});

	public register = Wrapper(async (req: Request, res: Response) => {
		validator(AuthSchema, req.body);
		const {
			body: { email, password },
		} = req;
		const user = await authService.register(email, password);

		return res.status(StatusCodes.CREATED).json({
			message: "Registration successful",
			data: user,
		});
	});
}

export default new AuthController();
