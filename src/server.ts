import handler from "@tanstack/react-start/server-entry";
import { app } from "$lib/api/app";

export default {
	async fetch(
		request: Request,
		env: Cloudflare.Env,
		_ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname.startsWith("/api")) {
			return app.fetch(request, env);
		}
		return handler.fetch(request, { context: { env } });
	},
};
