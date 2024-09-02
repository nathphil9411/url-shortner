import request from "supertest";
import { faker } from "@faker-js/faker";
import app from "../server";

describe("Auth Routes", () => {
	let userCredentials = {
		email: faker.internet.email(),
		password: faker.internet.password(),
	};

	describe("Registration Tests", () => {
		test("should throw 409 due to invalid credentials", async () => {
			const response = await request(app)
				.post("/api/auth/register")
				.send({
					email: "nonexistent@example.com",
				});

			expect(response.status).toBe(422);
			expect(response.body).toHaveProperty("errors");
		});

		test("should successfully register a user", async () => {
			const response = await request(app)
				.post("/api/auth/register")
				.send(userCredentials);

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty(
				"email",
				userCredentials.email
			);
		});
	});

	describe("Login Tests", () => {
		test("should throw 409 due to invalid credentials", async () => {
			const response = await request(app).post("/api/auth/login").send({
				email: "nonexistent@example.com",
			});

			expect(response.status).toBe(422);
			expect(response.body).toHaveProperty("errors");
		});

		test("should successfully login a user", async () => {
			const response = await request(app)
				.post("/api/auth/login")
				.send(userCredentials);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("access_token");
		});
	});
});
