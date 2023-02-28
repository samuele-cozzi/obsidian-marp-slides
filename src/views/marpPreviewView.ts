import { ItemView, WorkspaceLeaf, TFile, MarkdownView, normalizePath, FileSystemAdapter, Setting } from 'obsidian';
import { Marp } from '@marp-team/marp-core'

import { MarpSlidesSettings } from '../utilities/settings'

export const MARP_PREVIEW_VIEW = 'marp-preview-view';

export class MarpPreviewView extends ItemView  {
    private marp = new Marp();
    private settings : MarpSlidesSettings;

    constructor(settings: MarpSlidesSettings, leaf: WorkspaceLeaf) {
        super(leaf);

        this.settings = settings;
    }

    getViewType() {
        return MARP_PREVIEW_VIEW;
    }

    getDisplayText() {
        return "Deck Preview";
    }

    async onOpen() {
        const fileContents: string[] = await Promise.all(
            this.app.vault.getFiles()
                .filter(x => x.parent.path == normalizePath(this.settings.ThemePath))
                .map((file) => this.app.vault.cachedRead(file))
        );

        fileContents.forEach((content) => {
            this.marp.themeSet.add(content);
        });
    }

    async onClose() {
        //console.log("Marp Preview onClose View");
        // Nothing to clean up.
    }

    async onChange(view : MarkdownView) {
        console.log("Marp Preview onChange View");
        this.displaySlides(view);
    }
    
    async displaySlides(view : MarkdownView) {
        console.log("Marp Preview Display Slides");

        const basePath = this.getCurrentFileBasePath(view.file);
        const markdownText = view.data;
        
        const container = this.containerEl.children[1];
        container.empty();
       
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