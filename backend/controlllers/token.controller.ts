import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import tokenService from "../services/token.service";
import Wrapper from "../middlewears/wrapper";

class TokenController {
	public create = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { email },
		} = req as any;
		const token = await tokenService.create(email);
		return res
			.status(StatusCodes.CREATED)
			.json({ message: "Token Created.", data: token });
	});

	public get = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { email },
		} = req as any;
		const data = await tokenService.get(email);
		return res.status(StatusCodes.OK).json({ message: "Success", data });
	});

	public delete = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { email },
		} = req as any;
		await tokenService.delete(email);
		return res
			.status(StatusCodes.NO_CONTENT)
			.json({ message: "Token Deleted." });
	});
}

export default new TokenController();
