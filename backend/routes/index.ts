import path from "path";
import config from "../config";
import fs from "fs";
import { Express, Router } from "express";
import urlController from "../controlllers/url.controller";
import rateLimit from "express-rate-limit";
import Cache from "../middlewears/cache";

const routelist = <
	{
		default: {
			routeUrl: string;
			Router: Router;
		};
	}[]
>[];

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 500, // Limit each IP to 500 requests per per 15 minutes.
	standardHeaders: "draft-7",
	legacyHeaders: false,
});

const Routes = (app: Express) => {
	const filelist = fs.readdirSync(path.join(__dirname));

	// Importing all router files.
	for (const file of filelist) {
		if (file.includes(".router."))
			routelist.push(require(path.join(__dirname, file)));
	}

	let prefix = "";

	// Looks for a route prefix eg: (/api/v1)
	if (config.ROUTE_PREFIX) {
		if (config.ROUTE_PREFIX?.startsWith("/")) prefix = config.ROUTE_PREFIX;
		else prefix = "/" + config.ROUTE_PREFIX;
	}

	// Routes registration
	routelist.forEach((route) => {
		const { routeUrl, Router } = route.default;

		// Constructs the url for the route
		const url = prefix ? prefix + "/" + routeUrl : routeUrl;
		app.use(url, Router);
	});

	app.get("/:id", Cache, urlController.visit);
	console.log(`Successfully imported ${routelist.length} router(s)`);
};

export default Routes;
