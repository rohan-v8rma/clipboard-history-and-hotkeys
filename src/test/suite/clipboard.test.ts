import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { EXTENSION_NAME } from '../../constants';
import { writeNNumbersToClipboardOneByOne } from '../testUtils';

suite('Clipboard Functionality Test Suite', () => {
    test('Check if `numberOfClipboardItems` limit being enforced', async function() {
        this.timeout(0); // Eliminating the timeout threshold for this test.

        const workspaceConfig = vscode.workspace.getConfiguration(EXTENSION_NAME);

        const {
            numberOfClipboardItems,
            clipboardPollInterval
        } = workspaceConfig;

        vscode.window.showInformationMessage(clipboardPollInterval);

        await writeNNumbersToClipboardOneByOne(numberOfClipboardItems + 1);

        // Create a mock document
       const uri = vscode.Uri.parse('untitled:./test.txt', true);
       const mockDocument = await vscode.workspace.openTextDocument(uri);
       const editor = await vscode.window.showTextDocument(mockDocument);

       // Trigger the completion provider.
       const position = new vscode.Position(0, 0);
       const completionList = await vscode.commands.executeCommand<vscode.CompletionList>(
           'vscode.executeCompletionItemProvider',
           uri,
           position,
           '%'
       );

       const completionItems = completionList.items.map((item) => item.insertText);

       // The number of items won't be less, because we are copying N + 1 items to clipboard.
       assert.equal(
        completionItems.length, 
        numberOfClipboardItems, 
        `${completionItems.length} stored in clipboard. Max allowed is ${numberOfClipboardItems}.`
       );

       for(let i = 1; i <= numberOfClipboardItems; i++) {
          assert.equal(completionItems[i - 1], i, `${completionItems[i - 1]} present at position ${i}. Expected ${i}.`);
       }

    //    console.log(`completionList: ${JSON.stringify(completionList)}`);
    //    console.log(`completionItems: ${JSON.stringify(completionItems)}`);
    });
});