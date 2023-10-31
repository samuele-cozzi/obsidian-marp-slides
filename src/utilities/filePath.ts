import { Vault, normalizePath, FileSystemAdapter, TFile } from 'obsidian';
import { MarpSlidesSettings } from './settings';

export class FilePath  {

    private settings : MarpSlidesSettings;

    constructor(settings: MarpSlidesSettings) {
        this.settings = settings;
    }

    private getLinkFormat(file: TFile): string {
        console.log(`newLinkFormat: ${(file.vault as any).getConfig("newLinkFormat")}`);
        return (file.vault as any).getConfig("newLinkFormat");
    }

    private isAbsoluteLinkFormat(file: TFile): boolean {
        if(this.getLinkFormat(file) == "absolute"){
            return true;
        }
        else{
            return false;
        }
    }

    private getRootPath(file: TFile): string {
        
		let basePath = (file.vault.adapter as FileSystemAdapter).getBasePath();
        if (basePath.startsWith('/')){
            basePath = `/${normalizePath(basePath)}/`;
        }
        else
        {
            basePath = `${normalizePath(basePath)}/`;
        }

        console.log(`Root Path: ${basePath}`);
        return basePath;
	}

	public getCompleteFileBasePath(file: TFile): string{
        let resourcePath = [];
        if(this.isAbsoluteLinkFormat(file)){
            resourcePath = (file.vault.adapter as FileSystemAdapter).getResourcePath(normalizePath("/")).split("?");
        }
        else
        {
            resourcePath = (file.vault.adapter as FileSystemAdapter).getResourcePath(normalizePath(file.parent.path)).split("?");
        }
        console.log(`Complete File Base Path: ${resourcePath}`);
        return `${resourcePath[0]}/`;
	}

    public getCompleteFilePath(file: TFile) : string{

        let basePath = `${this.getRootPath(file)}${normalizePath(file.path)}`;
        if(this.isAbsoluteLinkFormat(file)){
            basePath = `${this.getRootPath(file)}${normalizePath(file.name)}`;
        }
        console.log(`Complete File Path: ${basePath}`);
        return basePath;
	}

    public async copyFileToRoot(file: TFile) {
        if(this.isAbsoluteLinkFormat(file)){
            await (file.vault.adapter as FileSystemAdapter).copy(file.path, file.name);
            console.log(`copied!`);
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
        console.log(`Theme Path: ${themePath}`);
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
        const path = normalizePath(`${fileSystem.getBasePath()}/${vault.configDir}/plugins/marp-slides`) + '/';
        console.log(path);
        return path;
	}

    public getLibDirectory(vault: Vault): string {
        const pluginDirectory = this.getPluginDirectory(vault);
        const path = normalizePath(`${pluginDirectory}lib`) + '/';
        console.log(path);
        return path;
	}
}