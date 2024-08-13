import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';

import {
  EXTENSION_NAME, 
  ExtensionType
} from '../constants';

import {
  getCompletionItemsList, 
  updateWorkspaceVariableValue, 
  writeNNumbersToClipboardOneByOne, 
  writeTextToClipboard
} from './testUtils';

const testSuiteGenerator = (suiteName: ExtensionType) => (
  suite(suiteName, () => {
    test('Check if `numberOfClipboardItems` limit being enforced', async function() {
      // Increase the timeout to 0, because we are adding a delay for writing clipboard items.
      this.timeout(0);
    
      const {
        numberOfClipboardItems
      } = vscode.workspace.getConfiguration(EXTENSION_NAME);
    
      await writeNNumbersToClipboardOneByOne[suiteName](numberOfClipboardItems + 1);
    
      const {
        completionItemsList
      } = await getCompletionItemsList();
    
      // The number of items won't be less, because we are copying N + 1 items to clipboard.
      assert.strictEqual(
        completionItemsList.length, 
        numberOfClipboardItems, 
        `${completionItemsList.length} stored in clipboard. Max allowed is ${numberOfClipboardItems}.`
      );
    
      for(let i = 1; i <= numberOfClipboardItems; i++) {
        assert.strictEqual(
          completionItemsList[i - 1], 
          i.toString(), 
          `${completionItemsList[i - 1]} present at position ${i}. Expected ${i}.`
        );
      }
    
      //    console.log(`completionList: ${JSON.stringify(completionList)}`);
      //    console.log(`completionItems: ${JSON.stringify(completionItems)}`);
    });
    
    test('Change to `numberOfClipboardItems` contribution point value holds', async function() {
      // Increase the timeout to 0, because we are adding a delay for writing clipboard items.
      this.timeout(0);
        
      const { 
        numberOfClipboardItems 
      } = vscode.workspace.getConfiguration(EXTENSION_NAME);
    
      await writeNNumbersToClipboardOneByOne[suiteName](numberOfClipboardItems + 1);
    
      await updateWorkspaceVariableValue<number>('numberOfClipboardItems', numberOfClipboardItems - 1);
        
      const {
        completionItemsList,
      } = await getCompletionItemsList();
    
      assert.strictEqual(
        completionItemsList.length, 
        numberOfClipboardItems - 1, 
        `${completionItemsList.length} stored in clipboard. Max allowed is ${numberOfClipboardItems}.`
      );
        
      for(let i = 1; i <= numberOfClipboardItems - 1; i++) {
        assert.strictEqual(
          completionItemsList[i - 1], 
          i.toString(), 
          `${completionItemsList[i - 1]} present at position ${i}. Expected ${i}.`
        );
      }
    
      await updateWorkspaceVariableValue<number>('numberOfClipboardItems', numberOfClipboardItems);
    });
    
    test('Check if clearing the clipboard works', async function() {
      // Increase the timeout to 0, because we are adding a delay for writing clipboard items.
      this.timeout(0);
    
      const {
        numberOfClipboardItems
      } = vscode.workspace.getConfiguration(EXTENSION_NAME);
    
      await writeNNumbersToClipboardOneByOne[suiteName](numberOfClipboardItems + 1);
    
      await vscode
        .commands
        .executeCommand(
          `${EXTENSION_NAME}.clearClipboard`
        );
    
      const {
        completionItemsList,
      } = await getCompletionItemsList();
    
      assert.strictEqual(
        completionItemsList.length, 
        0, 
        `${completionItemsList} stored in clipboard. Expected 0.`
      );
    });
    
    test('Check if shortcuts are working', async function() {
      // Increase the timeout to 0, because we are adding a delay for writing clipboard items.
      this.timeout(0);
    
      const {
        numberOfClipboardItems
      } = vscode.workspace.getConfiguration(EXTENSION_NAME);
    
      await writeNNumbersToClipboardOneByOne[suiteName](numberOfClipboardItems + 1);
    
      const {
        completionItemsList,
      } = await getCompletionItemsList();
    
      completionItemsList.forEach(async (item, index) => {
        const nthCompletionItem: vscode.CompletionItem = await vscode
          .commands
          .executeCommand<vscode.CompletionItem>(
          `${EXTENSION_NAME}.fetchItem`,
          index + 1
        );
    
        assert.strictEqual(
          item, 
          nthCompletionItem.label, 
          `${item} present at position ${index + 1}. Expected ${nthCompletionItem.label}.`
        );
      });
    });
    
    test('Check if duplicates are being removed from the list.', async function() {
      // Increase the timeout to 0, because we are adding a delay for writing clipboard items.
      this.timeout(0);
    
      await vscode
        .commands
        .executeCommand(
          `${EXTENSION_NAME}.clearClipboard`
        );    
    
      await writeTextToClipboard[suiteName]('FIRST');
      await writeTextToClipboard[suiteName]('SECOND');
      await writeTextToClipboard[suiteName]('FIRST');
        
      const {
        completionItemsList,
      } = await getCompletionItemsList();
    
      // Check if the duplicates are removed.
      assert.strictEqual(
        completionItemsList.length, 
        2, 
        `${completionItemsList.length} stored in clipboard. Expected 2.`
      );
    });
  })
);

export default testSuiteGenerator;