import { MarkdownView, TAbstractFile, Plugin, FileSystemAdapter, normalizePath, addIcon } from 'obsidian';

import { MARP_PREVIEW_VIEW, MarpPreviewView } from './views/marpPreviewView';
import { MarpExport } from './utilities/marpExport';
import { ICON_SLIDE_PREVIEW, ICON_SLIDE_SHOW } from './utilities/icons';
import { MarpSlidesSettings, MarpSlidesSettingTab, DEFAULT_SETTINGS } from 'utilities/settings';


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
		const ribbonIconEl = this.addRibbonIcon('slides-preview-marp', 'Show Slide Preview', async () => {
			await this.showPreviewSlide();
		});
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		addIcon('slides-show-marp', ICON_SLIDE_SHOW);
		this.addRibbonIcon('slides-show-marp', 'Show Slide Preview', async () => {
			await this.showPreviewSlide();
		});
		
		this.addCommand({
			id: 'marp-slides-preview',
			name: 'Slide Preview',
			callback: () => {
				this.showPreviewSlide();
			}
		});
		
		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'marp-export-pdf',
			name: 'Export PDF',
			callback: async () => {
				const file = this.getCurrentFilePath();
				
				const marpCli = new MarpExport(this.settings);
				await marpCli.export(file,'pdf');
			}
		});

		this.addCommand({
			id: 'marp-export-pdf-notes',
			name: 'Export PDF with Notes',
			callback: async () => {
				const file = this.getCurrentFilePath();
				
				const marpCli = new MarpExport(this.settings);
				await marpCli.export(file,'pdf-with-notes');
			}
		});

		this.addCommand({
			id: 'marp-export-html',
			name: 'Export HTML',
			callback: async () => {
				const file = this.getCurrentFilePath();
				
				const marpCli = new MarpExport(this.settings);
				await marpCli.export(file,'html');
			}
		});

		this.addCommand({
			id: 'marp-export-pptx',
			name: 'Export PPTX',
			callback: async () => {
				const file = this.getCurrentFilePath();
				
				const marpCli = new MarpExport(this.settings);
				await marpCli.export(file,'pptx');
			}
		});

		this.addCommand({
			id: 'marp-export-png',
			name: 'Export PNG',
			callback: async () => {
				const file = this.getCurrentFilePath();
				
				const marpCli = new MarpExport(this.settings);
				await marpCli.export(file,'png');
			}
		});

		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MarpSlidesSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

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
		// if (!this.settings.autoReload) {
		// 	return;
		// }

		if (file == this.editorView?.file) {
			this.slidesView.onChange(this.editorView);
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
	
		await this.app.workspace.getRightLeaf(false).setViewState({
			type: MARP_PREVIEW_VIEW,
			active: true,
		});

		const leaf = this.app.workspace.getLeavesOfType(MARP_PREVIEW_VIEW)[0];

		this.app.workspace.revealLeaf(leaf);

		return leaf.view as MarpPreviewView;
	}

	private getCurrentFilePath() {
		const file = this.app.workspace.getActiveFile();
		const basePath = (file?.vault.adapter as FileSystemAdapter).getBasePath();
		console.log(basePath);
		console.log(file);

		const filePath = `${basePath}\\${file?.path.replace(/\//g,"\\")}`;
		console.log(filePath);
		
		return normalizePath(filePath);
	}
}

