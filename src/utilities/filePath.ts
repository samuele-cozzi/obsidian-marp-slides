import { Vault, normalizePath, FileSystemAdapter, TFile } from 'obsidian';
import { MarpSlidesSettings } from './settings';

export class FilePath {

    private settings : MarpSlidesSettings;

    constructor(settings: MarpSlidesSettings) {
        this.settings = settings;
    }

    private getRootPath(file: TFile): string {
        
		let basePath = (file.vault.adapter as FileSystemAdapter).getBasePath();
        if (basePath.startsWith('/')){
            basePath = `/${normalizePath(basePath)}`;
        }
        else
        {
            basePath = normalizePath(basePath);
        }
		console.log(`Root Path: ${basePath}`);
		return basePath;
	}

	getCompleteFileBasePath(file: TFile): string{
        const resourcePath = (file.vault.adapter as FileSystemAdapter).getResourcePath(normalizePath(file.parent.path)).split("?");
        console.log(`Complete File Base Path: ${resourcePath}`);
        return `${resourcePath[0]}/`;
	}

    getCompleteFilePath(file: TFile) : string{
        const basePath = `${this.getRootPath(file)}/${normalizePath(file.path)}`;
        console.log(`Complete File Path: ${basePath}`);
        return basePath;
	}

    getThemePath(file: TFile): string{
        const themePath = `${this.getRootPath(file)}/${normalizePath(this.settings.ThemePath)}`;
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