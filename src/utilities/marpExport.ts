import type { marpCli } from '@marp-team/marp-cli'

export class MarpCLIError extends Error {}

export class MarpExport {

    async export(filePath: string | undefined, type: string){
        console.log(filePath);
        if (filePath !== undefined){
            let argv: string[] = [filePath,'--allow-local-files'];
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
                    argv.push('--png');
                    break;
            }
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