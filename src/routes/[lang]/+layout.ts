import { isValidLanguage, getDefaultLanguage } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	const lang = params.lang;

	if (!lang || !isValidLanguage(lang)) {
		const defaultLang = getDefaultLanguage();
		throw redirect(307, `/${defaultLang}`);
	}

	return {
		lang: lang as 'en' | 'jp'
	};
};

