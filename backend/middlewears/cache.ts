import { NextFunction, Request, Response } from "express";
import redisClient, { getRedisKey } from "./redis_client";
import { StatusCodes } from "http-status-codes";

const Cache = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const cachedUrl = await redisClient.get(getRedisKey(req));
		if (cachedUrl) {
			return res.status(StatusCodes.OK).json(JSON.parse(cachedUrl));
		}
		next();
	} catch (error: any) {
		console.error("An error occured while trying to run the server");
		next();
	}
};

export default Cache;
