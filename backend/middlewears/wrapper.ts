import { NextFunction, Request, Response } from "express";

const Wrapper = (fn: Function) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await fn(req, res, next);
		} catch (error: any) {
			next(error);
		}
	};
};

export default Wrapper;
