import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { EXTENSION_NAME } from '../../constants';
import { getCompletionItemsList, writeNNumbersToClipboardOneByOne } from '../testUtils';

suite('Clipboard Functionality Test Suite', () => {
    test('Check if `numberOfClipboardItems` limit being enforced', async function() {
        this.timeout(0); // Eliminating the timeout threshold for this test.

        const {
         numberOfClipboardItems,
         clipboardPollInterval
        } = vscode.workspace.getConfiguration(EXTENSION_NAME);


        vscode.window.showInformationMessage(clipboardPollInterval);

        await writeNNumbersToClipboardOneByOne(numberOfClipboardItems + 1);

       const completionList: vscode.CompletionList = await getCompletionItemsList();

    //    console.log(JSON.stringify(completionList));

       const completionItems = completionList.items.map((item) => item.insertText);

    //    console.log(JSON.stringify(completionItems));

       // The number of items won't be less, because we are copying N + 1 items to clipboard.
       assert.strictEqual(
        completionItems.length, 
        numberOfClipboardItems, 
        `${completionItems.length} stored in clipboard. Max allowed is ${numberOfClipboardItems}.`
       );

       for(let i = 1; i <= numberOfClipboardItems; i++) {
          assert.strictEqual(
            completionItems[i - 1], 
            i.toString(), 
            `${completionItems[i - 1]} present at position ${i}. Expected ${i}.`);
       }

    //    console.log(`completionList: ${JSON.stringify(completionList)}`);
    //    console.log(`completionItems: ${JSON.stringify(completionItems)}`);
    });
});