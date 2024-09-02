import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import urlService from "../services/url.service";
import UAParser from "ua-parser-js";
import Wrapper from "../middlewears/wrapper";
import redisClient, {
	deleteKeysByPattern,
	getRedisKey,
} from "../middlewears/redis_client";
import validator from "../middlewears/validators";
import {
	CreateURLSchema,
	UpdateURLSchema,
} from "../middlewears/validators/url.validator";

class UrlController {
	public create = Wrapper(async (req: Request, res: Response) => {
		validator(CreateURLSchema, req.body);
		const data = await urlService.create({
			...req.body,
			user_id: (req as any).user ? (req as any).user.email : undefined,
		});
		if ((req as any).user)
			deleteKeysByPattern(`/url|+|${(req as any).user.email}*`);
		return res
			.status(StatusCodes.CREATED)
			.json({ message: "Sucessfully created URL.", data });
	});

	public getMany = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { email },
			query: { page, limit },
		} = req as any;

		const data = await urlService.getMany(email, {
			page: page ? parseInt(page) : 1,
			limit: limit ? parseInt(limit) : 10,
		});
		redisClient.set(
			getRedisKey(req),
			JSON.stringify({ message: "Success", data }),
			{
				EX: 60 * 60 * 12, // 12 hours
			}
		);
		return res.status(StatusCodes.OK).json({ message: "Success", data });
	});

	public getOne = Wrapper(async (req: Request, res: Response) => {
		const {
			user: { email },
			params: { id: url_id },
		} = req as any;
		const data = await urlService.getOne(email, url_id);
		redisClient.set(
			getRedisKey(req),
			JSON.stringify({ message: "Success", data }),
			{
				EX: 60 * 60 * 12, // 12 hours
			}
		);
		return res.status(StatusCodes.OK).json({ message: "Success", data });
	});

	public visit = Wrapper(async (req: Request, res: Response) => {
		const { id } = req.params;
		const parsed_user_agent = UAParser(req.headers["user-agent"]);

		const data = await urlService.visit(id, {
			...parsed_user_agent,
			ip: req.headers["x-forwarded-for"] || req.ip,
		});

		// If the URL has an owner, it means the analytics is being tracked, hence we need to make sure the cached data is up to date.
		if (data.email) {
			deleteKeysByPattern(`/url|+|${data.email}*`);
		}

		return res.render("redirect", { url: data.url, is_safe: data.is_safe });
	});

	public update = Wrapper(async (req: Request, res: Response) => {
		validator(UpdateURLSchema, req.body);
		const {
			params: { id },
			user: { email },
			body,
		} = req as any;
		const data = await urlService.update(id, email, body);
		// Removes the cached data if it exists about the user, and the updated data
		const cacheKey = getRedisKey(req);
		if (await redisClient.get(cacheKey)) {
			redisClient.del(getRedisKey(req));
			deleteKeysByPattern(`/url|+|${email}*`);
		}
		return res
			.status(StatusCodes.OK)
			.json({ message: "Successfully updated URL.", data: data });
	});

	public generateQRCode = Wrapper(async (req: Request, res: Response) => {
		const {
			params: { id },
			user: { email },
		} = req as any;
		const data = await urlService.QRCode(id, email);
		return res.json({ message: "QRCode generated successfully", data });
	});

	public delete = Wrapper(async (req: Request, res: Response) => {
		const {
			params: { id },
			user: { email },
		} = req as any;
		await urlService.delete(id, email);
		// Removes the cached data if it exists about the user, and the updated data
		const cacheKey = getRedisKey(req);
		if (await redisClient.get(cacheKey)) {
			redisClient.del(getRedisKey(req));
		}
		if (email) deleteKeysByPattern(`/url|+|${email}*`);
		return res.status(StatusCodes.NO_CONTENT).json({ message: "success" });
	});
}

export default new UrlController();
