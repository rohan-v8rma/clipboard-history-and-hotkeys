import * as vscode from 'vscode';

const numOfCompletionItems : number = 5;

function updateCompletionItems(
    completionItem: vscode.CompletionItem, 
    completionItems: vscode.CompletionItem[]
    ): void {
    
        if(completionItems.length === numOfCompletionItems) {
        completionItems.slice(0, -1);
    }

    completionItems.unshift(completionItem);
}


function pollClipboard(
    previousClipboardContent: string, 
    completionItems: vscode.CompletionItem[]
    ): void {
    vscode.env.clipboard.readText().then((text) => {
        const clipboardContent: string = text;

        if (clipboardContent !== previousClipboardContent) {
            vscode.window.showInformationMessage(clipboardContent);
            
            // Creating a completion item using the new clipboard content.
            const completionItem: vscode.CompletionItem = new vscode.CompletionItem(clipboardContent);

            updateCompletionItems(completionItem, completionItems);
            console.log(completionItems);
        }

        previousClipboardContent = clipboardContent;

        // Schedule the next check after the specified delay
        setTimeout(pollClipboard, 100, previousClipboardContent, completionItems); 
    });
};



export { pollClipboard, updateCompletionItems };