import * as vscode from 'vscode';
import { EXTENSION_NAME } from '../constants';


export async function writeNNumbersToClipboardOneByOne(
    n: number
) {
    const { clipboardPollInterval } = vscode.workspace.getConfiguration(EXTENSION_NAME);

    // return new Promise((resolve, reject) => {
    //     let tryingToWrite = n + 1;
    //     let previouslyWritten = n + 1;

    //     const interval = setInterval(async () => {
    //         // console.log(`tried N: ${n}`);

    //         // The number we tried to write should have already been written.
    //         if(previouslyWritten !== tryingToWrite) {
    //             return;
    //         }

    //         // The current number should be exactly 1 less than the number already written.
    //         if(previouslyWritten - n !== 1) {
    //             return;
    //         }
    //         tryingToWrite = n;

    //         // console.log(`tryingToWrite: ${tryingToWrite}`);

    //         await vscode.env.clipboard.writeText(n.toString());
    //         // console.log(`${n}: ${await vscode.env.clipboard.readText()}`);
    //         previouslyWritten = n;
    //         n--;

    //         if(n === 0) {
    //             clearInterval(interval);
    //             /* 
    //             This timeout is not necessary for ensuring that text is written to clipboard, it is for ensuring 
    //             that the clipboard is polled for the last number which is 1, and that item is added to the completion
    //             item array of the extension
    //             */
    //             await new Promise(resolve => {setTimeout(() => resolve(true), 2 * clipboardPollInterval);});
    //             resolve(0);
    //         }
    //     }, 2 * clipboardPollInterval); 
    //     // We choose double the clipboardPollInterval to allow for inconsistencies in clipboard polling
    // });

    return new Promise(async (resolve, reject) => {
        while(n > 0) {
            await vscode.env.clipboard.writeText(n.toString());
            n--;

            // Waiting for the item to be added to CompletionItem array.
            await new Promise((resolve) => setTimeout(resolve, clipboardPollInterval * 2, true));
        }

        resolve(true);
    });
}


export async function getCompletionItemsList() {
    // Create a mock document
    const uri = vscode.Uri.parse('untitled:./test.txt', true);
    const mockDocument = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(mockDocument);

    // Trigger the completion provider.
    const position = new vscode.Position(0, 0);
    
    const { triggerCharacter } = vscode.workspace.getConfiguration(EXTENSION_NAME);

    return vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        uri,
        position,
        triggerCharacter
    );
}