require("dotenv").config({ path: "./.env" });

const config: Iconfig = {
	ROUTE_PREFIX: "api",
	BASE_URL: "https://arowobenedict.tech/",
	NODE_ENV: "production",
	PORT: parseInt(process.env.PORT as string) || 5000,
	JWT_SECERET: process.env.JWT_SECERET as string,
	USE_WORKER: (process.env.USE_WORKER as string) === "true" ? true : false,
	REDIS: {
		HOST: process.env.REDIS_HOST as string,
		PORT: parseInt(process.env.REDIS_PORT as string),
		PASSWORD: process.env.REDIS_PASSWORD as string,
	},
	OPTIONS: {
		SCAN_URLS: true,
		UPDATE_USER_IP_INFO: true,
		TOKEN_EXPIRY_DAYS: 7,
		TOKEN_LENGTH: 32,
	},
	DB: {
		HOST: process.env.HOST as string,
		PORT: parseInt(process.env.PORT as string),
		USER: process.env.USER as string,
		PASSWORD: process.env.PASSWORD as string,
		DATABASE: process.env.DATABASE as string,
	},
	TOKENS: {
		WEATHER_API: process.env.WEATHER_API_TOKEN as string,
		CLOUDINARY: {
			CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
			API_KEY: process.env.CLOUDINARY_API_KEY as string,
			API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
		},
		VIRUSTOTAL_API_KEY: process.env.VIRUSTOTAL_API_KEY as string,
	},
	GMAIL: {
		USER: process.env.GMAIL_USER as string,
		PASS: process.env.GMAIL_PASS as string,
	},
};

export default config;

interface Iconfig {
	ROUTE_PREFIX?: string;
	BASE_URL: string;
	NODE_ENV: "development" | "production";
	PORT: number;
	JWT_SECERET: string;
	USE_WORKER: boolean;
	REDIS: {
		HOST: string;
		PORT: number;
		PASSWORD: string;
	};
	OPTIONS: {
		SCAN_URLS: boolean;
		UPDATE_USER_IP_INFO: boolean;
		TOKEN_EXPIRY_DAYS: number;
		TOKEN_LENGTH: number;
	};
	DB: {
		HOST: string;
		PORT: number;
		USER: string;
		PASSWORD: string;
		DATABASE: string;
	};
	TOKENS: {
		WEATHER_API: string;
		CLOUDINARY: {
			CLOUD_NAME: string;
			API_KEY: string;
			API_SECRET: string;
		};
		VIRUSTOTAL_API_KEY: string;
	};
	GMAIL: {
		USER: string;
		PASS: string;
	};
}
