import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
	connection: {
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!,
	}
})

export const app = new Hono()

.use(cors())

.get("/", (c) => {
	return c.text("Hello Hono!");
})

.get("/hello", async (c) => {
	const data: ApiResponse = {
		message: "Hello BHVR!",
		success: true,
	};

	return c.json(data, { status: 200 });
});

export default app;