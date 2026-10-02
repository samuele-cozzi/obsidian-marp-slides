import { Vault, normalizePath, FileSystemAdapter, TFile, App } from 'obsidian';
import { MarpSlidesSettings } from './settings';

export class FilePath  {

    private settings : MarpSlidesSettings;

    constructor(settings: MarpSlidesSettings) {
        this.settings = settings;
    }

    private getLinkFormat(file: TFile): string {
        //console.log(`newLinkFormat: ${(file.vault as any).getConfig("newLinkFormat")}`);
        return (file.vault as any).getConfig("newLinkFormat");
    }

    public isAbsoluteLinkFormat(file: TFile): boolean {
        if(this.getLinkFormat(file) == "absolute"){
            return true;
        }
        else{
            return false;
        }
    }

    public getRootPath(file: TFile): string {
        
		let basePath = (file.vault.adapter as FileSystemAdapter).getBasePath();
        if (basePath.startsWith('/')){
            basePath = `/${normalizePath(basePath)}/`;
        }
        else
        {
            basePath = `${normalizePath(basePath)}/`;
        }

        //console.log(`Root Path: ${basePath}`);
        return basePath;
	}

	public getCompleteFileBasePath(file: TFile): string{
        let resourcePath = [""];
        if(this.isAbsoluteLinkFormat(file)){
            resourcePath = (file.vault.adapter as FileSystemAdapter).getResourcePath(normalizePath("/")).split("?");
        }
        else
        {
            if (file.parent != null){
                resourcePath = (file.vault.adapter as FileSystemAdapter).getResourcePath(normalizePath(file.parent.path)).split("?");
            }
        }
        //console.log(`Complete File Base Path: ${resourcePath}`);
        return `${resourcePath[0]}/`;
	}

    public getCompleteFilePath(file: TFile) : string{

        let basePath = `${this.getRootPath(file)}${normalizePath(file.path)}`;
        if(this.isAbsoluteLinkFormat(file)){
            basePath = `${this.getRootPath(file)}${normalizePath(file.name)}`;
        }
        //console.log(`Complete File Path: ${basePath}`);
        return basePath;
	}

    public async copyFileToRoot(file: TFile) {
        if(this.isAbsoluteLinkFormat(file)){
            await (file.vault.adapter as FileSystemAdapter).copy(file.path, file.name);
            //console.log(`copied!`);
        }
    }

    public async removeFileFromRoot(file: TFile) {
        const isFileExists = await (file.vault.adapter as FileSystemAdapter).exists(file.name);
        if(this.isAbsoluteLinkFormat(file) && isFileExists){
            await (file.vault.adapter as FileSystemAdapter).remove(file.name);
        }
    }

    public getThemePath(file: TFile): string{
        const themePath = `${this.getRootPath(file)}${normalizePath(this.settings.ThemePath)}`;
        //console.log(`Theme Path: ${themePath}`);
        if (this.settings.ThemePath != ''){
            return themePath;
        } 
        else
        {
            return '';
        }
    }

    private getPluginDirectory(vault: Vault): string {
        const fileSystem = vault.adapter as FileSystemAdapter;
        const path = `${fileSystem.getBasePath()}/${normalizePath(vault.configDir)}/plugins/marp-slides/`;
        //console.log(path);
        return path;
	}

    public getLibDirectory(vault: Vault): string {
        const pluginDirectory = this.getPluginDirectory(vault);
        const path = `${pluginDirectory}lib3/`;
        //console.log(path);
        return path;
	}

    public getMarpEngine(vault: Vault): string {
        const libDirectory = this.getLibDirectory(vault);
        const path = `${libDirectory}marp.config.js`;
        //console.log(path);
        return path;
	}

    /**
     * Convert Obsidian wiki-link image syntax to standard Markdown.
     * Transforms ![[image.png]] to ![image.png](path/to/image.png)
     */
    public convertImageWikiLinks(markdown: string, sourceFile: TFile, app: App): string {
        // Image extensions to convert
        const imageExtensions = /\.(png|jpg|jpeg|gif|svg|webp|bmp)$/i;

        // Regex: ![[filename]] or ![[filename|alt text]]
        const wikiLinkRegex = /!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;

        return markdown.replace(wikiLinkRegex, (match, filename, altText) => {
            // Only process image files
            if (!imageExtensions.test(filename)) {
                return match;
            }

            // Use Obsidian's link resolver to find the file
            const linkedFile = app.metadataCache.getFirstLinkpathDest(filename, sourceFile.path);

            if (linkedFile) {
                // Build path based on link format setting
                let imagePath: string;
                if (this.isAbsoluteLinkFormat(sourceFile)) {
                    // Absolute: path from vault root
                    imagePath = linkedFile.path;
                } else {
                    // Relative: path from source file's folder
                    imagePath = this.getRelativePathFromFile(sourceFile, linkedFile);
                }

                const alt = altText || filename;
                return `![${alt}](${imagePath})`;
            }

            // File not found - return original
            return match;
        });
    }

    /**
     * Calculate relative path from source file to target file.
     */
    private getRelativePathFromFile(sourceFile: TFile, targetFile: TFile): string {
        const sourceParts = sourceFile.parent?.path.split('/').filter(p => p) || [];
        const targetParts = targetFile.path.split('/').filter(p => p);

        // Find common prefix length
        let commonLength = 0;
        while (commonLength < sourceParts.length &&
               commonLength < targetParts.length - 1 &&
               sourceParts[commonLength] === targetParts[commonLength]) {
            commonLength++;
        }

        // Build relative path
        const upCount = sourceParts.length - commonLength;
        const relativeParts = [...Array(upCount).fill('..'), ...targetParts.slice(commonLength)];

        return relativeParts.join('/');
    }
}