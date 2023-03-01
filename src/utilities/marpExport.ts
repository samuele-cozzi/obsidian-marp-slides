import marpCli, { CLIError, CLIErrorCode } from '@marp-team/marp-cli'
import { normalizePath } from 'obsidian';
import { MarpSlidesSettings } from './settings';

export class MarpCLIError extends Error {}

export class MarpExport {

    private settings : MarpSlidesSettings;

    constructor(settings: MarpSlidesSettings) {
        this.settings = settings;
    }

    async export(rootPath: string, filePath: string | undefined, type: string){
        if (filePath !== undefined){
            const themePath = normalizePath(`${rootPath}\\${this.settings.ThemePath}`);
            const completeFilePath = normalizePath(`${rootPath}\\${filePath}`);
            console.log(completeFilePath);
            console.log(themePath);
            //const argv: string[] = [filePath,'--allow-local-files', '--theme-set', normalizePath('C:\\Users\\samue\\code\\knowledge-base\\templates\\marp\\themes')];
            const argv: string[] = [completeFilePath,'--allow-local-files', '--theme-set', themePath];
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