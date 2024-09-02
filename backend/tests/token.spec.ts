import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import authService from "../services/auth.service";
import app from "../server";
import { User } from "./url.spec";

const prisma = new PrismaClient();

describe("Token Routes", () => {
	let user: User = {
		access_token: undefined,
		api_token: undefined,
		email: undefined,
		url: {
			id: undefined,
			short_url: undefined,
		},
	};

	beforeAll(async () => {
		const password = faker.internet.password();
		const email = faker.internet.email();

		await prisma.user.create({
			data: {
				email,
				password,
			},
		});

		user.access_token = authService["generateToken"]({ email });
		user.email = email;
	});

	afterAll(async () => {
		await prisma.user.delete({
			where: {
				email: user.email,
			},
		});
		await prisma.$disconnect();
	});

	it("should fail to create a new token no auth", async () => {
		const response = await request(app).post("/api/token");

		expect(response.status).toBe(401);
	});

	it("should create a new token", async () => {
		const response = await request(app)
			.post("/api/token")
			.set("Authorization", `Bearer ${user.access_token}`)
			.send();

		expect(response.status).toBe(201);
		expect(response.body.data).toHaveProperty("token");
		user.api_token = response.body.data.token;
	});

	it("should delete user's token using api-token", async () => {
		const response = await request(app)
			.delete("/api/token")
			.set("api_key", user.api_token as string);

		expect(response.status).toBe(204);
	});
});
