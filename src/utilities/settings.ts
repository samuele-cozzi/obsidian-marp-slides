import { App, PluginSettingTab, Setting } from 'obsidian';
import MarpSlides from '../main';

export interface MarpSlidesSettings {
	CHROME_PATH: string;
	ThemePath: string;
}

export const DEFAULT_SETTINGS: MarpSlidesSettings = {
	CHROME_PATH: '',
	ThemePath: ''
}


export class MarpSlidesSettingTab extends PluginSettingTab {
	private plugin: MarpSlides;

	constructor(app: App, plugin: MarpSlides) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'MARP Slide Plugin - Settings'});

		new Setting(containerEl)
			.setName('Chrome Path')
			.setDesc('Sets the custom path for Chrome or Chromium-based browser to export PDF, PPTX, and image. If it\'s empty, Marp will find out the installed Google Chrome / Chromium / Microsoft Edge.')
			.addText(text => text
				.setPlaceholder('Enter CHROME_PATH')
				.setValue(this.plugin.settings.CHROME_PATH)
				.onChange(async (value) => {
					console.log('Chrome Path: ' + value);
					this.plugin.settings.CHROME_PATH = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Theme Path')
			.setDesc('Local paths to additional <a href="https://marpit.marp.app/theme-css">theme CSS</a> for Marp core and Marpit framework. The rule for paths is following Markdown: Styles.')
			.addText(text => text
				.setPlaceholder('template\\marp\\themes')
				.setValue(this.plugin.settings.ThemePath)
				.onChange(async (value) => {
					console.log('Theme Path: ' + value);
					this.plugin.settings.ThemePath = value;
					await this.plugin.saveSettings();
				}));
	}
}