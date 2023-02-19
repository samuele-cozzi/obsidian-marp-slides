import { ItemView, MarkdownView, Menu, WorkspaceLeaf } from 'obsidian';

export const MARP_PREVIEW_VIEW = 'marp-preview-view';

export class MarpPreviewView extends ItemView  {
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return MARP_PREVIEW_VIEW;
    }

    getDisplayText() {
        return "Example view";
    }

    async onOpen() {
        console.log("Marp Preview onOpen View");

        // const container = this.containerEl.children[1];
        // container.empty();
        // container.createEl("h4", { text: "Example view" });
    }

    async onClose() {
        console.log("Marp Preview onClose View");
        // Nothing to clean up.
    }

    async onChange() {
        console.log("Marp Preview onChange View");
        // Nothing to clean up.
    }
    
    displaySlides() {
        console.log("Marp Preview Display Slides");

        const container = this.containerEl.children[1];
        container.empty();
        container.innerHTML = "<div>Hello Word!</div>";
        //this.contentEl.createDiv({ text: "hello word!" })

		// const viewContent = this.containerEl.children[1];

		// viewContent.empty();
		// viewContent.addClass('reveal-preview-view');
		// viewContent.createEl('iframe', {
		// 	attr: {
		// 		// @ts-ignore:
		// 		src: this.url,
		// 		sandbox: 'allow-scripts allow-same-origin allow-popups',
		// 	},
		// });
	}
}