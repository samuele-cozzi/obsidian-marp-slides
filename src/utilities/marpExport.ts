import marpCli, { CLIError, CLIErrorCode } from '@marp-team/marp-cli'

export class MarpCLIError extends Error {}

export class MarpExport {

    constructor(chromePath: string) {
        const { CHROME_PATH } = process.env;

        try {
            process.env.CHROME_PATH = chromePath || CHROME_PATH;
            
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
            //process.env.CHROME_PATH = CHROME_PATH
        }
    }

    async export(filePath: string | undefined, type: string){
        console.log(filePath);
        if (filePath !== undefined){
            const argv: string[] = [filePath,'--allow-local-files'];
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
            await this.runMarpCli(argv);
        } 

    }

    //async exportPdf(argv: string[], opts?: MarpCLIAPIOptions | undefined){
    private async runMarpCli(argv: string[]){

        //console.info(`Execute Marp CLI [${argv.join(' ')}] (${JSON.stringify(opts)})`)
        console.info(`Execute Marp CLI [${argv.join(' ')}]`);
        console.log(process.env.CHROME_PATH);

        // const { marpCli } = await import(
        //     '@marp-team/marp-cli'
        // )
        
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
                if (e instanceof CLIError){
                    console.log("Errore!");
                    const err = e as CLIError;
                    console.log(e.message);
                    console.log(e.errorCode);
                } else {
                    console.log("Errore");
                }
            });
    }
}