import { normalizePath, FileSystemAdapter, TFile } from 'obsidian';
import { MarpSlidesSettings } from './settings';

export class FilePath {

    private settings : MarpSlidesSettings;

    constructor(settings: MarpSlidesSettings) {
        this.settings = settings;
    }

    private getRootPath(file: TFile): string {
		const basePath = (file.vault.adapter as FileSystemAdapter).getBasePath();
		console.log(`Root Path: ${basePath}`);
		return basePath;
	}

	getCompleteFileBasePath(file: TFile): string{
        const basePath = `${this.getRootPath(file)}/${normalizePath(file.parent.path)}/`;
        console.log(`Complete File Base Path: ${basePath}`);
        return basePath;
	}

    getCompleteFilePath(file: TFile) : string{
        const basePath = `${this.getRootPath(file)}/${normalizePath(file.path)}`;
        console.log(`Complete File Path: ${basePath}`);
        return basePath;
	}

    getThemePath(file: TFile): string{
        const themePath = `${this.getRootPath(file)}/${normalizePath(this.settings.ThemePath)}`;
        if (this.settings.ThemePath != ''){
            return themePath;
        } 
        else
        {
            return '';
        }
    }
}