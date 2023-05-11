export interface MarpSlidesSettings {
	CHROME_PATH: string;
	ThemePath: string;
	EnableHTML: boolean;
	MathTypesettings: string ;
}

export const DEFAULT_SETTINGS: MarpSlidesSettings = {
	CHROME_PATH: '',
	ThemePath: '',
	EnableHTML: false,
	MathTypesettings: 'mathjax'
}