//import { ItemView, MarkdownView, Menu, WorkspaceLeaf } from 'obsidian';
import { Marp } from '@marp-team/marp-core'
import type { marpCli } from '@marp-team/marp-cli'

export class MarpCLIError extends Error {}

export class MarpExport {

    async exportHtml(filePath: string | undefined) {
        console.log(filePath);
        if (filePath !== undefined){
            let argv: string[] = [filePath,'--allow-local-files'];
            await this.runMarpCli(argv);
        } 
    }
    
    async exportPdf(filePath: string | undefined) {
        console.log(filePath);
        if (filePath !== undefined){
            let argv: string[] = [filePath, '--pdf','--allow-local-files'];
            await this.runMarpCli(argv);
        } 
    }

    async exportPdfWithNotes(filePath: string | undefined) {
        console.log(filePath);
        if (filePath !== undefined){
            let argv: string[] = [filePath, '--pdf','--pdf-notes','--pdf-outlines','--allow-local-files'];
            await this.runMarpCli(argv);
        } 
    }

    async exportPptx(filePath: string | undefined) {
        console.log(filePath);
        if (filePath !== undefined){
            let argv: string[] = [filePath, '--pptx','--allow-local-files'];
            await this.runMarpCli(argv);
        } 
    }

    async exportPng(filePath: string | undefined) {
        console.log(filePath);
        if (filePath !== undefined){
            let argv: string[] = [filePath, '--image', 'png','--allow-local-files'];
            await this.runMarpCli(argv);
        } 
    }


    //async exportPdf(argv: string[], opts?: MarpCLIAPIOptions | undefined){
    private async runMarpCli(argv: string[]){

        //console.info(`Execute Marp CLI [${argv.join(' ')}] (${JSON.stringify(opts)})`)
        console.info(`Execute Marp CLI [${argv.join(' ')}]`);

        const { marpCli, CLIError, CLIErrorCode } = await import(
            '@marp-team/marp-cli'
        )
        const { CHROME_PATH } = process.env

        try {
            //process.env.CHROME_PATH = marpConfiguration().get<string>('chromePath') || CHROME_PATH
            process.env.CHROME_PATH = CHROME_PATH

            console.log("start marp cli");
            //exitCode = await marpCli(argv, opts)
            marpCli(argv)
            .then((exitStatus) => {
                if (exitStatus > 0) {
                console.error(`Failure (Exit status: ${exitStatus})`)
                } else {
                console.log('Success')
                }
            })
            .catch((e) =>{
                console.log("Errore");
                console.log(e);
            });

            console.log("start marp cli");
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

}