import marpCli, { CLIError, CLIErrorCode } from '@marp-team/marp-cli'
import { TFile, App } from 'obsidian';
import { MarpSlidesSettings } from './settings';
import { FilePath } from './filePath';
import { writeFileSync, readFileSync } from 'fs-extra';

export class MarpCLIError extends Error {}

export class MarpExport {

    private settings : MarpSlidesSettings;
    private app : App | null;

    constructor(settings: MarpSlidesSettings, app: App | null = null) {
        this.settings = settings;
        this.app = app;
    }

    async export(file: TFile, type: string){
        const filesTool = new FilePath(this.settings);
        await filesTool.removeFileFromRoot(file);
        await filesTool.copyFileToRoot(file);
        const completeFilePath = filesTool.getCompleteFilePath(file);
        const themePath = filesTool.getThemePath(file);
        const resourcesPath = filesTool.getLibDirectory(file.vault);
        const marpEngineConfig = filesTool.getMarpEngine(file.vault);

        // Convert wiki-link images to standard markdown before export
        if (this.app && completeFilePath != '') {
            try {
                const originalContent = readFileSync(completeFilePath, 'utf-8');
                const processedContent = filesTool.convertImageWikiLinks(originalContent, file, this.app);
                writeFileSync(completeFilePath, processedContent, 'utf-8');
            } catch (e) {
                console.error('Failed to process wiki-links for export:', e);
            }
        }

        if (completeFilePath != ''){
            //console.log(completeFilePath);

            const argv: string[] = [completeFilePath,'--allow-local-files'];
            //const argv: string[] = ['--engine', '@marp-team/marp-core', completeFilePath,'--allow-local-files'];

            if (this.settings.EnableMarkdownItPlugins){
                argv.push('--engine');
                argv.push(marpEngineConfig);
            }

            if (themePath != ''){
                argv.push('--theme-set');
                argv.push(themePath);
            }

            if (this.settings.EnableHTML){
                argv.push('--html');
            }

            switch (type) {
                case 'pdf':
                    argv.push('--pdf');
                    if (this.settings.EXPORT_PATH != ''){
                        argv.push('-o');
                        argv.push(`${this.settings.EXPORT_PATH}${file.basename}.pdf`);
                    }
                    break;
                case 'pdf-with-notes':
                    argv.push('--pdf');
                    argv.push('--pdf-notes');
                    argv.push('--pdf-outlines');
                    if (this.settings.EXPORT_PATH != ''){
                        argv.push('-o');
                        argv.push(`${this.settings.EXPORT_PATH}${file.basename}.pdf`);
                    }
                    break;
                case 'pptx':
                    argv.push('--pptx');
                    if (this.settings.EXPORT_PATH != ''){
                        argv.push('-o');
                        argv.push(`${this.settings.EXPORT_PATH}${file.basename}.pptx`);
                    }
                    break;
                case 'png':
                    argv.push('--images');
                    argv.push('--png');
                    if (this.settings.EXPORT_PATH != ''){
                        argv.push('-o');
                        argv.push(`${this.settings.EXPORT_PATH}${file.basename}.png`);
                    }
                    break;
                case 'html':
                    argv.push('--html');
                    argv.push('--template');
                    argv.push(this.settings.HTMLExportMode);
                    break;
                case 'preview':
                    argv.push('--html');
                    argv.push('--preview');
                    break;
                default:
                    //argv.push('--template');
                    //argv.push('bare');
                    //argv.push('bespoke');
                    //argv.push('--engine');
                    //argv.push('@marp-team/marpit');
                    //argv.remove(completeFilePath);
                    //process.env.PORT = "5001";
                    //argv.push('PORT=5001');
                    //argv.push('--server');
                    
                    //argv.push('--watch');
            }
            await this.run(argv, resourcesPath);
        } 

    }

    //async exportPdf(argv: string[], opts?: MarpCLIAPIOptions | undefined){
    private async run(argv: string[], resourcesPath: string){
        const { CHROME_PATH } = process.env;

        try {
            process.env.CHROME_PATH = this.settings.CHROME_PATH || CHROME_PATH;

            this.runMarpCli(argv, resourcesPath);
            
        } catch (e) {
            console.error(e)

            if (
                e instanceof CLIError &&
                e.errorCode === CLIErrorCode.NOT_FOUND_CHROMIUM
            ) {
                const browsers = ['[Google Chrome](https://www.google.com/chrome/)']

                if (process.platform === 'linux')
                    browsers.push('[Chromium](https://www.chromium.org/)')

                browsers.push('[Microsoft Edge](https://www.microsoft.com/edge)')

                throw new MarpCLIError(
                    `It requires to install ${browsers
                    .join(', ')
                    .replace(/, ([^,]*)$/, ' or $1')} for exporting.`
                )
            }

            throw e
        } finally {
            process.env.CHROME_PATH = CHROME_PATH
        }
    }

    private async runMarpCli(argv: string[], resourcesPath: string) {
        //console.info(`Execute Marp CLI [${argv.join(' ')}] (${JSON.stringify(opts)})`)
        console.info(`Execute Marp CLI [${argv.join(' ')}]`);
        let temp__dirname = __dirname;

        try {    
            __dirname = resourcesPath;
            const exitCode = await marpCli(argv, {});

            if (exitCode > 0) {
                console.error(`Failure (Exit status: ${exitCode})`)
            }
        } catch(e) {
            if (e instanceof CLIError){
                console.error(`CLIError code: ${e.errorCode}, message: ${e.message}`);
            } else {
                console.error("Generic Error!");
            }
        }

        __dirname = temp__dirname;
    }
}