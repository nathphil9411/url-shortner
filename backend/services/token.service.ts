import { Token } from "../prisma/db";
import {
	BadrequestError,
	InternalServerError,
	NotFoundError,
} from "../middlewears/error";
import crypto from "crypto";
import config from "../config";

class TokenController {
	public create = async (user_id: string) => {
		const token = await Token.findUnique({
			where: {
				user_id,
			},
		});

		if (token)
			throw new BadrequestError("User already has an access token.");

		const new_token = await Token.create({
			data: {
				user_id,
				token: crypto
					.randomBytes(config.OPTIONS.TOKEN_LENGTH || 16)
					.toString("hex"),
				expiration_date: this.calculateExpirationDate(
					config.OPTIONS.TOKEN_EXPIRY_DAYS || 7
				),
				is_revoked: false,
			},
			select: {
				token: true,
				expiration_date: true,
			},
		});

		return new_token;
	};

	public get = async (user_id: string) => {
		const token = await Token.findUnique({
			where: {
				user_id,
			},
		});

		if (!token) {
			throw new NotFoundError("User has no token.");
		}

		return token;
	};

	public delete = async (user_id: string) => {
		try {
			await Token.delete({
				where: {
					user_id,
				},
			});

			return 0;
		} catch (error: any) {
			if (error.code === "P2025")
				throw new NotFoundError("Token does not exist.");
			return new InternalServerError(error.message);
		}
	};

	private calculateExpirationDate = (days: number) => {
		return new Date(Date.now() + 60 * 60 * 1000 * 24 * days);
	};
}

export default new TokenController();
