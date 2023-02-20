import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { MARP_PREVIEW_VIEW, MarpPreviewView } from './views/marpPreviewView';

// Remember to rename these classes and interfaces!

interface MarpSlidesSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MarpSlidesSettings = {
	mySetting: 'default'
}

export default class MarpSlides extends Plugin {
	settings: MarpSlidesSettings;

	private markdownViewText : string;

	async onload() {
		console.log("marp slides - start");
		await this.loadSettings();

		this.registerView(
			MARP_PREVIEW_VIEW,
			(leaf) => new MarpPreviewView(leaf)
		);

		const ribbonIconEl = this.addRibbonIcon('slides', 'Show Slide Preview', async () => {
			await this.showView();
		});
		
		// // This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });

		// // Perform additional things with the ribbon
		//ribbonIconEl.addClass('my-plugin-ribbon-class');




		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				this.showView();
				//new MarpSlidesModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new MarpSlidesModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MarpSlidesSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		console.log("marp slides - end");
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

	async showView() {
		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		console.log(markdownView?.data);
		
		const file = this.app.workspace.getActiveFile();
		console.log(file);
		const resourcePath = file?.vault.adapter.getResourcePath("");
		const rootPath = resourcePath?.substring(0, resourcePath.indexOf("?"))
		const basePath = `${rootPath}/${file?.parent.path}`;
		console.log(basePath);

		if (!markdownView) {
			return;
		}

		if (markdownView.data == this.markdownViewText && this.app.workspace.getLeavesOfType(MARP_PREVIEW_VIEW).length > 0) {
			return;
		}

		this.markdownViewText = markdownView.data;
		
		const instance = await this.activateView();
		instance.displaySlides(this.markdownViewText);

		// const url = this.revealServer.getUrl();
		// url.pathname = this.fixedEncodeURIComponent(this.target.path);

		// this.openUrl(url);
		// this.showMotm();

		//const instance = this.getViewInstance();
	}

	// async activateView() {
	// 	this.app.workspace.detachLeavesOfType(MARP_PREVIEW_VIEW);
	
	// 	await this.app.workspace.getRightLeaf(false).setViewState({
	// 	  type: MARP_PREVIEW_VIEW,
	// 	  active: true,
	// 	});
	
	// 	this.app.workspace.revealLeaf(
	// 	  this.app.workspace.getLeavesOfType(MARP_PREVIEW_VIEW)[0]
	// 	);
	// }

	// getViewInstance() : MarpPreviewView {
	// 	for (const leaf of this.app.workspace.getLeavesOfType(MARP_PREVIEW_VIEW)) {
	// 		const view = leaf.view;
	// 		if (view instanceof MarpPreviewView) {
	// 			return view;
	// 		}
	// 	}
	// 	return new MarpPreviewView(this.app.workspace.getLeavesOfType(MARP_PREVIEW_VIEW)[0]);
	// }

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

	
}

class MarpSlidesModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class MarpSlidesSettingTab extends PluginSettingTab {
	plugin: MarpSlides;

	constructor(app: App, plugin: MarpSlides) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
