import { isValidLanguage, getDefaultLanguage } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	const pathname = url.pathname;

	if (pathname === '/') {
		const defaultLang = getDefaultLanguage();
		throw redirect(307, `/${defaultLang}`);
	}

	const lang = pathname.split('/')[1];

	if (!lang || !isValidLanguage(lang)) {
		const defaultLang = getDefaultLanguage();
		throw redirect(307, `/${defaultLang}`);
	}
};

