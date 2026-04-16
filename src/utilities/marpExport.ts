import marpCli, { CLIError, CLIErrorCode } from '@marp-team/marp-cli'
import { TFile, App } from 'obsidian';
import { MarpSlidesSettings } from './settings';
import { FilePath } from './filePath';
import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'fs-extra';
import { exportToPptx } from 'dom-to-pptx';
import * as path from 'path';

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

			if (type === 'editable-pptx') {
				argv.push('--html');
				argv.push('--template');
				argv.push(this.settings.HTMLExportMode);

				const tempHtmlPath = completeFilePath.replace(/\.md$/, '.temp.html');
				argv.push('-o');
				argv.push(tempHtmlPath);

				await this.run(argv, resourcesPath);

				if (existsSync(tempHtmlPath)) {
					try {
						const html = readFileSync(tempHtmlPath, 'utf-8');
						const iframe = document.createElement('iframe');
						iframe.style.position = 'fixed';
						iframe.style.top = '-10000px';
						iframe.style.left = '-10000px';
						iframe.style.width = '1280px';
						iframe.style.height = '720px';
						iframe.style.border = 'none';
						document.body.appendChild(iframe);

						const iframeDoc = iframe.contentWindow?.document;
						if (!iframeDoc) {
							throw new Error('Could not access iframe document');
						}

						iframeDoc.open();
						iframeDoc.write(html);
						iframeDoc.close();

						// Wait for styles and fonts to load within the iframe
						await new Promise(resolve => {
							const checkLoaded = async () => {
								if (iframe.contentWindow) {
									iframe.contentWindow.onload = async () => {
										await (iframe.contentWindow as any).document.fonts.ready;
										resolve(null);
									};
									if (iframe.contentWindow.document.readyState === 'complete') {
										await (iframe.contentWindow as any).document.fonts.ready;
										resolve(null);
									}
								} else {
									setTimeout(resolve, 2000);
								}
							};
							checkLoaded();
							setTimeout(resolve, 5000);
						});

						// Extra wait for Marp's auto-scaling to settle
						await new Promise(resolve => setTimeout(resolve, 1000));

						const sections = Array.from(iframeDoc.querySelectorAll('section'));

						if (sections.length > 0) {
							const pptxBlob = await exportToPptx(sections, {
								fileName: `${file.basename}.pptx`,
								skipDownload: true,
							});

							const arrayBuffer = await pptxBlob.arrayBuffer();
							const buffer = Buffer.from(arrayBuffer);

							let exportDir = this.settings.EXPORT_PATH;
							if (!exportDir) {
								exportDir = path.dirname(completeFilePath);
							}

							const finalPptxPath = path.join(exportDir, `${file.basename}.pptx`);
							writeFileSync(finalPptxPath, buffer);
							console.info(`Exported editable PPTX to ${finalPptxPath}`);
						} else {
							console.error('No slide sections found in the generated HTML.');
						}

						document.body.removeChild(iframe);
						unlinkSync(tempHtmlPath);
					} catch (e) {
						console.error('Error during editable-pptx export:', e);
					}
				}
				return;
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

			await this.runMarpCli(argv, resourcesPath);
            
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
