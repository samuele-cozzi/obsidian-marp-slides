import { ItemView, MarkdownView, Menu, WorkspaceLeaf } from 'obsidian';
import { Marp } from '@marp-team/marp-core'

export const MARP_PREVIEW_VIEW = 'marp-preview-view';

export class MarpPreviewView extends ItemView  {
    private marp = new Marp();

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return MARP_PREVIEW_VIEW;
    }

    getDisplayText() {
        return "Deck Preview";
    }

    async onOpen() {
        //console.log("Marp Preview onOpen View");
    }

    async onClose() {
        //console.log("Marp Preview onClose View");
        // Nothing to clean up.
    }

    async onChange() {
        console.log("Marp Preview onChange View");
        // Nothing to clean up.
    }
    
    displaySlides(basePath: string, markdownText: string) {
        console.log("Marp Preview Display Slides");
        
        const container = this.containerEl.children[1];
        container.empty();
        
        var { html, css } = this.marp.render(markdownText);
        //console.log(html);
        
        // Replace Backgorund Url for images
        html = html.replace(/background-image:url\(&quot;/g, `background-image:url(&quot;${basePath}`);

        const htmlFile = `
            <!DOCTYPE html>
            <html>
            <head>
            <base href="${basePath}"></base>
            <style>${css}</style>
            </head>
            <body>${html}</body>
            </html>
            `
        container.innerHTML = htmlFile;
	}
}