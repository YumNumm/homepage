export const supportedLanguages = ['en', 'jp'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export function isValidLanguage(lang: string): lang is SupportedLanguage {
	return supportedLanguages.includes(lang as SupportedLanguage);
}

export function getDefaultLanguage(): SupportedLanguage {
	return 'en';
}

