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

        if (completeFilePath != ''){            
            console.log(completeFilePath);
            
            const argv: string[] = [completeFilePath,'--allow-local-files'];
            
            if (themePath != ''){
                console.log(themePath);
                argv.push('--theme-set');
                argv.push(themePath);
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
                default:
                    argv.push('--template');
                    argv.push('bare');
                    //argv.push('bespoke');
                    //argv.push('--engine');
                    //argv.push('@marp-team/marpit');
            }
            await this.run(argv);
        } 

    }

    //async exportPdf(argv: string[], opts?: MarpCLIAPIOptions | undefined){
    private async run(argv: string[]){
        const { CHROME_PATH } = process.env;

        try {
            process.env.CHROME_PATH = this.settings.CHROME_PATH || CHROME_PATH;

            this.runMarpCli(argv);
            
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

    private async runMarpCli(argv: string[]) {
        //console.info(`Execute Marp CLI [${argv.join(' ')}] (${JSON.stringify(opts)})`)
        console.info(`Execute Marp CLI [${argv.join(' ')}]`);
        
        try {
            const exitCode = await marpCli(argv)

            if (exitCode > 0) {
                console.error(`Failure (Exit status: ${exitCode})`)
            } else {
                console.log('Success')
            }
        } catch(e) {
            if (e instanceof CLIError){
                console.log(`CLIError code: ${e.errorCode}, message: ${e.message}`);
            } else {
                console.log("Generic Error!");
            }
        }
    }
}