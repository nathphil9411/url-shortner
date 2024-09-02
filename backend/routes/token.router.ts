import express from "express";
import tokenController from "../controlllers/token.controller";
import { AuthenticatedOnly } from "../middlewears/authenticated";
import { limiter } from ".";
const Router = express.Router();

Router.route("/")
	.get(AuthenticatedOnly, limiter, tokenController.get)
	.post(AuthenticatedOnly, limiter, tokenController.create)
	.delete(AuthenticatedOnly, limiter, tokenController.delete);

export default {
	routeUrl: "token",
	Router,
};
