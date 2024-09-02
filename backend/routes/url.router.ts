import express from "express";
import urlController from "../controlllers/url.controller";
import { Authenticate, AuthenticatedOnly } from "../middlewears/authenticated";
import { limiter } from ".";
import Cache from "../middlewears/cache";
const Router = express.Router();

Router.route("/url/")
	.get(AuthenticatedOnly, limiter, Cache, urlController.getMany)
	.post(Authenticate, limiter, urlController.create);
Router.route("/url/:id")
	.get(AuthenticatedOnly, limiter, Cache, urlController.getOne)
	.patch(AuthenticatedOnly, urlController.update)
	.delete(AuthenticatedOnly, urlController.delete);
Router.route("/url/:id/qrcode").post(
	AuthenticatedOnly,
	limiter,
	urlController.generateQRCode
);
// Router.get("/:id", urlController.visit); !! Moved to routes/index.ts file

export default {
	routeUrl: "",
	Router,
};
