import { ItemView, MarkdownView, Menu, WorkspaceLeaf } from 'obsidian';

export const MARP_PREVIEW_VIEW = 'marp-preview-view';

export class MarpPreviewView extends ItemView  {
    getDisplayText(): string {
        return "Slide Preview";
    }
    
    // getViewData() {
    //     return this.;
    // }

    // setViewData(data: string, clear: boolean) {
    //     this.data = data;
    // }

    // clear() {
    //     this.data = "";
    // }

    getViewType() {
        return MARP_PREVIEW_VIEW;
    }

    onChange() {
        this.displayView();
    }

    
    displayView() {
        console.log("Display View");

        this.contentEl.empty();
        this.containerEl.innerHTML = "<div>Hello Word!</div>"
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