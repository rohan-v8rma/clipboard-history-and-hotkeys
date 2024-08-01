import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

import {
  getCompletionItemsList, updateWorkspaceVariableValue, waitForDelay, writeNNumbersToClipboardOneByOne 
} from '../testUtils';

import {
  EXTENSION_NAME 
} from '../../constants';

suite('Clipboard Functionality Test Suite', () => {
  test('Check if `numberOfClipboardItems` limit being enforced', async function() {
    this.timeout(0); // Eliminating the timeout threshold for this test.

    const {
      numberOfClipboardItems
    } = vscode.workspace.getConfiguration(EXTENSION_NAME);

    await writeNNumbersToClipboardOneByOne(numberOfClipboardItems + 1);

    const completionList: vscode.CompletionList = await getCompletionItemsList();

    // console.log(numberOfClipboardItems);
    // console.log(JSON.stringify(completionList));

    const completionItems = completionList.items.map((item) => item.insertText);

    // console.log(JSON.stringify(completionItems));

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
        `${completionItems[i - 1]} present at position ${i}. Expected ${i}.`
      );
    }

    //    console.log(`completionList: ${JSON.stringify(completionList)}`);
    //    console.log(`completionItems: ${JSON.stringify(completionItems)}`);
  });

  test('Change to `numberOfClipboardItems` contribution point value holds', async function() {
    this.timeout(0); // Eliminating the timeout threshold for this test.
    
    const clipboardPollInterval = 100;

    const { 
      numberOfClipboardItems 
    } = vscode.workspace.getConfiguration(EXTENSION_NAME);

    await updateWorkspaceVariableValue<number>('numberOfClipboardItems', numberOfClipboardItems - 1);

    await waitForDelay(clipboardPollInterval * 3);
    
    const completionList: vscode.CompletionList = await getCompletionItemsList();

    const completionItems = completionList.items.map((item) => item.insertText);

    assert.strictEqual(
      completionItems.length, 
      numberOfClipboardItems - 1, 
      `${completionItems.length} stored in clipboard. Max allowed is ${numberOfClipboardItems}.`
    );
    
    for(let i = 1; i <= numberOfClipboardItems - 1; i++) {
      assert.strictEqual(
        completionItems[i - 1], 
        i.toString(), 
        `${completionItems[i - 1]} present at position ${i}. Expected ${i}.`
      );
    }

    await updateWorkspaceVariableValue<number>('numberOfClipboardItems', numberOfClipboardItems + 1);

    await waitForDelay(clipboardPollInterval);
  });
});