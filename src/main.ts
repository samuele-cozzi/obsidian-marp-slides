import { MarkdownView, TAbstractFile, Plugin, addIcon, App, PluginSettingTab, Setting  } from 'obsidian';

import { MARP_PREVIEW_VIEW, MarpPreviewView } from './views/marpPreviewView';
import { MarpExport } from './utilities/marpExport';
import { ICON_SLIDE_PREVIEW } from './utilities/icons';
import { MarpSlidesSettings, DEFAULT_SETTINGS } from 'utilities/settings';


export default class MarpSlides extends Plugin {
	
	public settings: MarpSlidesSettings;
	private slidesView : MarpPreviewView;
	private editorView : MarkdownView | null;

	async onload() {
		await this.loadSettings();

		this.registerView(
			MARP_PREVIEW_VIEW,
			(leaf) => new MarpPreviewView(this.settings, leaf)
		);

		addIcon('slides-preview-marp', ICON_SLIDE_PREVIEW);
		this.addRibbonIcon('slides-preview-marp', 'Show Slide Preview', async () => {
			await this.showPreviewSlide();
		});
		
		this.addCommand({
			id: 'preview',
			name: 'Slide Preview',
			callback: () => {
				this.showPreviewSlide();
			}
		});
		
		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'export-pdf',
			name: 'Export PDF',
			callback: (() => this.exportFile('pdf'))
		});

		this.addCommand({
			id: 'export-pdf-notes',
			name: 'Export PDF with Notes',
			callback: (() => this.exportFile('pdf-with-notes'))
		});

		this.addCommand({
			id: 'export-html',
			name: 'Export HTML',
			callback: (() => this.exportFile('html'))
		});

		this.addCommand({
			id: 'export-pptx',
			name: 'Export PPTX',
			callback: (() => this.exportFile('pptx'))
		});

		this.addCommand({
			id: 'export-png',
			name: 'Export PNG',
			callback: (() => this.exportFile('png'))
		});		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MarpSlidesSettingTab(this.app, this));

		this.registerEvent(this.app.vault.on('modify', this.onChange.bind(this)));
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(MARP_PREVIEW_VIEW);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	onChange(file: TAbstractFile) {
		if (file == this.editorView?.file) {
			this.slidesView.onChange(this.editorView);
		}
	}

	async exportFile(type: string){
		const file = this.app.workspace.getActiveFile();
		if(file !== null){	
		const marpCli = new MarpExport(this.settings);
			await marpCli.export(file,type);
		}
	}

	async showPreviewSlide(){
		this.editorView = this.app.workspace.getActiveViewOfType(MarkdownView);

		if (!this.editorView) {
			return;
		}

		this.slidesView = await this.activateView();
		this.slidesView.displaySlides(this.editorView);
	}
	
	async activateView() : Promise<MarpPreviewView> {
		this.app.workspace.detachLeavesOfType(MARP_PREVIEW_VIEW);
	
		await this.app.workspace.getLeaf('split').setViewState({
			type: MARP_PREVIEW_VIEW,
			active: true,
		});

		const leaf = this.app.workspace.getLeavesOfType(MARP_PREVIEW_VIEW)[0];

		this.app.workspace.revealLeaf(leaf);

		return leaf.view as MarpPreviewView;
	}
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
					this.plugin.settings.CHROME_PATH = value;
					await this.plugin.saveSettings();
				}));
		
		new Setting(containerEl)
			.setName('Theme Path')
			.setDesc('Local paths to additional theme CSS for Marp core and Marpit framework. The rule for paths is following Markdown: Styles.')
			.addText(text => text
				.setPlaceholder('template\\marp\\themes')
				.setValue(this.plugin.settings.ThemePath)
				.onChange(async (value) => {
					this.plugin.settings.ThemePath = value;
					await this.plugin.saveSettings();
				}));
	}
}
