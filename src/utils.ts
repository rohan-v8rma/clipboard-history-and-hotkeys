import * as vscode from 'vscode';

// This variable helps in the sequencing of completion items according to the time at which they were copied, instead of alphabetical ordering.
let itemSequenceNum : number = 1e8;

const workspaceConfig = vscode.workspace.getConfiguration('log-copypluspaste');

const numOfCompletionItems: number = workspaceConfig.numberOfClipboardItems;

export function updateCompletionItems(
    completionItem: vscode.CompletionItem, 
    completionItems: vscode.CompletionItem[]
    ): void {
    
    if(completionItems.length === numOfCompletionItems) {
        /* 
        This removes the last completion item.

        We do this so that the number of completion items in the list remains same.
        */
        completionItems.pop();
    }

    completionItems.unshift(completionItem);
}


export function pollClipboard(
    previousClipboardContent: string, 
    completionItems: vscode.CompletionItem[]
    ): void {
    vscode.env.clipboard.readText().then((text) => {
        const clipboardContent: string = text;

        if (clipboardContent !== previousClipboardContent) {
            vscode.window.showInformationMessage(clipboardContent);
            
            // Creating a completion item using the new clipboard content.
            const completionItem: vscode.CompletionItem = new vscode.CompletionItem(clipboardContent);

            /* 
            We modify the sortText property of the completion item we are about to add to our completion item array.

            In this way, the most recently copied item appears at the top, and the least recent one appears at the bottom.
            */
            completionItem.sortText = "!" + itemSequenceNum.toString().padStart(9, '0');

            itemSequenceNum--;

            updateCompletionItems(completionItem, completionItems);
            
            // console.log(completionItem.label + completionItem.sortText);
        }

        previousClipboardContent = clipboardContent;

        // Schedule the next check after the specified delay
        setTimeout(pollClipboard, 100, previousClipboardContent, completionItems); 
    });
};
