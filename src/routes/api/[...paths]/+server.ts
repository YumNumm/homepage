import { app, type HonoBindings } from "$lib/api/app";

export const GET = async ({ request, platform }) => {
	const Env = {
		...platform?.env,
		...(platform?.caches ? { caches: platform.caches } : {}),
	} as const satisfies HonoBindings;

	return await app.fetch(request, Env);
};

export const POST = GET;
export const PUT = GET;
