import marpCli, { CLIError, CLIErrorCode } from '@marp-team/marp-cli'
import { TFile } from 'obsidian';
import { MarpSlidesSettings } from './settings';
import { FilePath } from './filePath';

export class MarpCLIError extends Error {}

export class MarpExport {

    private settings : MarpSlidesSettings;

    constructor(settings: MarpSlidesSettings) {
        this.settings = settings;
    }

    async export(file: TFile, type: string){
        const completeFilePath = (new FilePath(this.settings)).getCompleteFilePath(file);
        const themePath = (new FilePath(this.settings)).getThemePath(file);
        const resourcesPath = (new FilePath(this.settings)).getLibDirectory(file.vault);

        if (completeFilePath != ''){            
            //console.log(completeFilePath);
            
            const argv: string[] = [completeFilePath,'--allow-local-files'];
            
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
                    break;
                case 'pdf-with-notes':
                    argv.push('--pdf');
                    argv.push('--pdf-notes');
                    argv.push('--pdf-outlines');
                    break;
                case 'pptx':
                    argv.push('--pptx');
                    break;
                case 'png':
                    argv.push('--images');
                    argv.push('--png');
                    break;
                case 'html':
                    argv.push('--template');
                    argv.push(this.settings.HTMLExportMode);
                    //argv.push('bare');
                    //argv.push('bespoke');
                    break;
                case 'preview':
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