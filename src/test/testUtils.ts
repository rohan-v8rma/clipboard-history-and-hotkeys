import * as vscode from 'vscode';
import { EXTENSION_NAME } from '../constants';

export async function writeNNumbersToClipboardOneByOne(
    n: number
) {
    const workspaceConfig = vscode.workspace.getConfiguration(EXTENSION_NAME);

    const { clipboardPollInterval } = workspaceConfig; 

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            vscode.env.clipboard.writeText(n.toString());
            n--;

            if(n === 0) {
                clearInterval(interval);
                resolve(0);
            }
        }, 2 * clipboardPollInterval);
    });
}