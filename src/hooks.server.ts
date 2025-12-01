import { getClient } from "$lib/api/client";

export const handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith("/api")) {
		return resolve(event);
	}

	return resolve(event);
};
