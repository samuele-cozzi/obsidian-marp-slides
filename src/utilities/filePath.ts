import { App, PluginSettingTab, Setting, normalizePath, FileSystemAdapter, TFile } from 'obsidian';
import MarpSlides from '../main';

export class FilePath {

    getRootPath(file: TFile): string {
		const basePath = normalizePath((file.vault.adapter as FileSystemAdapter).getBasePath());
		console.log(`Root Path: ${basePath}`);
		return basePath;
	}

	getCompleteFileBasePath(file: TFile){
        const basePath = `${this.getRootPath(file)}\\${file.parent.path}\\`;
        console.log(`Complete File Base Path: ${basePath}`);
        return `${normalizePath(basePath)}`;
	}

    getCompleteFilePath(file: TFile){
        const basePath = `${this.getRootPath(file)}\\${file.path}`;
        console.log(`Complete File Path: ${basePath}`);
        return `${normalizePath(basePath)}`;
	}

    getFilePath(file: TFile){
        const basePath = `${file.path}`;
        console.log(`File Path: ${basePath}`);
        return `${normalizePath(basePath)}`;
	}

}