import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import * as vscode from 'vscode';

import {
  EXTENSION_NAME 
} from './constants';

// This variable helps in the sequencing of completion items according to the time at which they were copied, instead of alphabetical ordering.
let itemSequenceNum : number = 1e8;

export function correctCompletionItemsLength(
  completionItems: vscode.CompletionItem[],
  requiredLength: number
) {
  while(completionItems.length > requiredLength) {
    /* 
        This removes the last completion item, until it is under the max limit of clipboard items.

        We do this so that the number of completion items adheres to the max limit.
        */
    completionItems.pop();
  }
}

export function updateCompletionItems(
  completionItem: vscode.CompletionItem, 
  completionItems: vscode.CompletionItem[]
): void {

  // We access these workspace variables within the function call, so that the updated value is used for every.
  const {
    numberOfClipboardItems,
  } = vscode.workspace.getConfiguration(EXTENSION_NAME);
  
  correctCompletionItemsLength(completionItems, numberOfClipboardItems - 1);

  completionItems.unshift(completionItem);
}


export function onClipboardChange(
  previousClipboardContent: string, 
  completionItems: vscode.CompletionItem[]
): void {
    
  // We access these workspace variables within the function call, so that the updated value is used everytime.
  const {
    numberOfClipboardItems,
  } = vscode.workspace.getConfiguration(EXTENSION_NAME);

  correctCompletionItemsLength(completionItems, numberOfClipboardItems);

  vscode.env.clipboard.readText().then((text) => {
    const clipboardContent: string = text;

    if (clipboardContent !== previousClipboardContent) {
      // vscode.window.showInformationMessage(clipboardContent);
            
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
  });
};
