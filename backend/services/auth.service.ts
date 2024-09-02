import config from "../config";
import ErrorParent, {
	BadrequestError,
	InternalServerError,
	NotFoundError,
} from "../middlewears/error";
import { User } from "../prisma/db";
import argon from "argon2";
import jwt from "jsonwebtoken";

class AuthService {
	public login = async (email: string, password: string) => {
		try {
			const user = await User.findUniqueOrThrow({ where: { email } });
			
			if (!(await this.verifyPassword(user.password, password)))
				throw new BadrequestError("Invalid password.");
			delete (user as any).password;
			const token = this.generateToken({ email });
			return { access_token: token, user };
		} catch (error: any) {
			console.log(error);
			if (error.code === "P2025")
				throw new NotFoundError("User not found.");
			if (error.code) throw new ErrorParent(error.message, error.code);
			return new InternalServerError(error.message);
		}
	};

	public register = async (email: string, password: string) => {
		try {
			const user = await User.create({
				data: {
					email,
					password: await argon.hash(password),
				},
			});

			delete (user as any).password;
			return user;
		} catch (error: any) {
			console.log(error.code);
			if (error.code === "P2002")
				throw new BadrequestError("Email already exists.");
			throw new InternalServerError(error.message);
		}
	};

	private verifyPassword = async (hashed_value: string, password: string) => {
		return await argon.verify(hashed_value, password);
	};

	private generateToken = (payload: any) => {
		return jwt.sign(payload, config.JWT_SECERET, {
			expiresIn: "3h",
		});
	};
}

export default new AuthService();
