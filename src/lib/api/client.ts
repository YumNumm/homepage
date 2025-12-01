import { hcWithType } from "./app";

export function getClient({ fetch = globalThis.fetch } = {}) {
	return hcWithType("/", { fetch });
}
