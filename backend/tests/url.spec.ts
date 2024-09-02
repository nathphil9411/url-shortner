import request from "supertest";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import authService from "../services/auth.service";
import app from "../server";

const prisma = new PrismaClient();

describe("URL Routes", () => {
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

		const demo_user = await prisma.user.create({
			data: {
				email,
				password,
			},
		});

		const token = await prisma.token.create({
			data: {
				user_id: demo_user.email,
				token: faker.string.uuid(),
				expiration_date: new Date(
					new Date().setHours(new Date().getHours() + 1)
				),
				is_revoked: false,
			},
		});

		user.access_token = authService["generateToken"]({ email });
		user.api_token = token.token;
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

	describe("Create URL Route - /api/url", () => {
		it("should create a new URL", async () => {
			const response = await request(app)
				.post("/api/url")
				.set("Authorization", `Bearer ${user.access_token}`)
				.send({
					long_url: "https://example.com",
				});

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty(
				"long_url",
				"https://example.com"
			);

			user.url.id = response.body.data.id;
			user.url.short_url = response.body.data.short_url;
		});

		it("should create a new URL with custom url", async () => {
			const custom_url = faker.string.alphanumeric({
				length: { min: 5, max: 7 },
			});

			const response = await request(app)
				.post("/api/url")
				.set("Authorization", `Bearer ${user.access_token}`)
				.send({
					long_url: "https://example.com",
					short_url: custom_url,
				});

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("short_url", custom_url);
			expect(response.body.data.owner_id).toBeDefined();
		});

		it("should create a new URL without being authenticated", async () => {
			const response = await request(app).post("/api/url").send({
				long_url: "https://example.com",
			});

			expect(response.status).toBe(201);
			expect(response.body).toHaveProperty("data");
		});
	});

	describe("GET /api/url", () => {
		it("should return a list of URLs", async () => {
			const response = await request(app)
				.get("/api/url")
				.set("Authorization", `Bearer ${user.access_token}`);

			expect(response.status).toBe(200);
			expect(Array.isArray(response.body.data)).toBe(true);
		});
	});

	describe("GET /api/url/:id", () => {
		it("should return a single URL by ID", async () => {
			const response = await request(app)
				.get(`/api/url/${user.url.id}`)
				.set("Authorization", `Bearer ${user.access_token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("long_url");
		});

		it("should return a single URL by ID using api-token", async () => {
			const response = await request(app)
				.get(`/api/url/${user.url.id}`)
				.set("api_key", user.api_token as string);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("long_url");
		});
	});

	describe("PATCH /api/url/:id", () => {
		it("should update a URL", async () => {
			const response = await request(app)
				.patch(`/api/url/${user.url.id}`)
				.set("Authorization", `Bearer ${user.access_token}`)
				.send({
					long_url: "https://newexample.com",
				});

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty(
				"long_url",
				"https://newexample.com"
			);
		});

		it("should update a URL using api-token", async () => {
			const response = await request(app)
				.patch(`/api/url/${user.url.id}`)
				.set("api_key", user.api_token as string)
				.send({
					long_url: "https://oldexample.com",
				});

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty(
				"long_url",
				"https://oldexample.com"
			);
		});
	});

	describe("GET /:id", () => {
		it("should visit a URL and update stats", async () => {
			const response = await request(app)
				.get(`/${user.url.short_url}`)
				.set("User-Agent", "Mozilla/5.0")
				.set("X-Forwarded-For", "123.123.123.123");

			expect(response.status).toBe(200);
			expect(response.text).toContain("Redirecting...");
		});
	});

	describe("POST /api/url/:id/qrcode", () => {
		it("should generate a QR code for a URL", async () => {
			const response = await request(app)
				.post(`/api/url/${user.url.id}/qrcode`)
				.set("Authorization", `Bearer ${user.access_token}`);

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data).toHaveProperty("url");
		});
	});

	describe("DELETE /api/url/:id", () => {
		it("should fail to delete a URL with no auth", async () => {
			const response = await request(app).delete(
				`/api/url/${user.url.id}`
			);

			expect(response.status).toBe(401);
		});

		it("should delete a URL", async () => {
			const response = await request(app)
				.delete(`/api/url/${user.url.id}`)
				.set("Authorization", `Bearer ${user.access_token}`);

			expect(response.status).toBe(204);
		});
	});
});

export interface User {
	access_token: string | undefined;
	api_token: string | undefined;
	url: {
		id: string | undefined;
		short_url: string | undefined;
	};
	email: string | undefined;
}
