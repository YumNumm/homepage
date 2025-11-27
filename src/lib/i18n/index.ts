export const supportedLanguages = ['en', 'jp'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const languageMap: Record<string, SupportedLanguage> = {
	ja: 'jp',
	'en-US': 'en',
	'en-GB': 'en',
	en: 'en'
};

export function isValidLanguage(lang: string): lang is SupportedLanguage {
	return supportedLanguages.includes(lang as SupportedLanguage);
}

export function getDefaultLanguage(headers?: Headers): SupportedLanguage {
	if (headers) {
		const acceptLanguage = headers.get('accept-language');
		if (acceptLanguage) {
			const languages = acceptLanguage
				.split(',')
				.map((lang) => lang.split(';')[0].trim().toLowerCase());
			
			for (const lang of languages) {
				if (lang.startsWith('ja')) {
					return 'jp';
				}
				if (lang.startsWith('en')) {
					return 'en';
				}
				if (languageMap[lang]) {
					return languageMap[lang];
				}
			}
		}
	}
	return 'en';
}

