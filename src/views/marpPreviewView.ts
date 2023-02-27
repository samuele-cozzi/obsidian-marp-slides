import { ItemView, WorkspaceLeaf, TFile, MarkdownView, normalizePath, FileSystemAdapter } from 'obsidian';
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

    async onChange(view : MarkdownView) {
        console.log("Marp Preview onChange View");
        this.displaySlides(view);
    }
    
    displaySlides(view : MarkdownView) {
        console.log("Marp Preview Display Slides");

        const basePath = this.getCurrentFileBasePath(view.file);
        const markdownText = view.data;
        
        const container = this.containerEl.children[1];
        container.empty();
        //this.marp.themeSet.add("");
        let { html, css } = this.marp.render(markdownText);
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

    getCurrentFileBasePath(file: TFile){
		// const resourcePath = this.app.vault.adapter.getResourcePath(file.parent.path);
		
        // let basePath = '';
		// if(file.parent.isRoot()){
		// 	basePath = `${resourcePath?.substring(0, resourcePath.indexOf("?"))}`;
		// }
		// else
		// {
		// 	basePath = `${resourcePath?.substring(0, resourcePath.indexOf("?"))}/`;
		// }

        const basePath1 = `${(file?.vault.adapter as FileSystemAdapter).getBasePath()}\\${file.parent.path}\\`;


		console.log(file);
        // console.log(basePath);
        // console.log(`${normalizePath(basePath)}/`);
        console.log(basePath1);
        console.log(`${normalizePath(basePath1)}/`);

        //app://local/C:/Users/samue/code/knowledge-base/bookshelf/tech_management/
        //app://local/C:/Users/samue/code/knowledge-base/bookshelf/tech_management/
		//return basePath;
        return `app://local/${normalizePath(basePath1)}/`;
	}	

}