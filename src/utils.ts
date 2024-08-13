import * as vscode from 'vscode';

import {
  EXTENSION_NAME 
} from './constants';

// This variable helps in the sequencing of completion items according to the time at which they were copied, instead of alphabetical ordering.
let itemSequenceNum : number = 1e8;

export function correctCompletionItemsLength(
  completionItems: vscode.CompletionItem[],
  requiredLength: number
): vscode.CompletionItem[] {
  while(completionItems.length > requiredLength) {
    /* 
        This removes the last completion item, until it is under the max limit of clipboard items.

        We do this so that the number of completion items adheres to the max limit.
        */
    completionItems.pop();
  }

  return completionItems;
}

export function updateCompletionItems(
  completionItem: vscode.CompletionItem, 
  completionItems: vscode.CompletionItem[]
): vscode.CompletionItem[] {
  // We access these workspace variables within the function call, so that the updated value is used for every.
  const {
    numberOfClipboardItems,
  } = vscode.workspace.getConfiguration(EXTENSION_NAME);
  
  completionItems = correctCompletionItemsLength(
    completionItems, 
    numberOfClipboardItems - 1
  );

  completionItems.unshift(completionItem);

  return completionItems
    .filter((
      currentCompletionItem: vscode.CompletionItem, 
      index: number
    ) => (
      // The first item, we've just added.
      (index === 0) 
      || (currentCompletionItem.label !== completionItem.label)
    ));
}

export function createCompletionItem(
  clipboardContent: string
): vscode.CompletionItem {
  // Creating a completion item using the new clipboard content.
  const completionItem: vscode.CompletionItem = new vscode.CompletionItem(clipboardContent);

  /* 
  We modify the sortText property of the completion item we are about to add to our completion item array.

  In this way, the most recently copied item appears at the top, and the least recent one appears at the bottom.
  */
  completionItem.sortText = "!" + itemSequenceNum.toString().padStart(9, '0');

  itemSequenceNum--;

  return completionItem;
}

export async function onClipboardChange(
  args: {
    completionItems: vscode.CompletionItem[]
  }
): Promise<void> {
  const text = await vscode.env.clipboard.readText();
    
  const clipboardContent: string = text;

  if (
    // Seeing if the clipboard content is not empty.
    clipboardContent 
    // Seeing if the clipboard content is not the same as the first completion item.
    && clipboardContent !== args.completionItems?.[0]?.label
  ) {
    // Creating a completion item using the new clipboard content.
    const completionItem: vscode.CompletionItem = createCompletionItem(clipboardContent);

    args.completionItems = updateCompletionItems(completionItem, args.completionItems);
  }
};

export async function pollClipboard(args: {
  completionItems: vscode.CompletionItem[],
}): Promise<void> {
  // We access these workspace variables within the function call, so that the updated value is used everytime.
  const {
    numberOfClipboardItems,
    clipboardPollInterval
  } = vscode.workspace.getConfiguration(EXTENSION_NAME);

  args.completionItems = correctCompletionItemsLength(
    args.completionItems, 
    numberOfClipboardItems
  );

  const clipboardContent: string = await vscode.env.clipboard.readText();

  if (
    // Seeing if the clipboard content is not empty.
    clipboardContent 
    // Seeing if the clipboard content is not the same as the first completion item.
    && clipboardContent !== args.completionItems?.[0]?.label
  ) {
    // Creating a completion item using the new clipboard content.
    const completionItem: vscode.CompletionItem = createCompletionItem(clipboardContent);
    
    args.completionItems = updateCompletionItems(completionItem, args.completionItems);
  }

  setTimeout(pollClipboard, clipboardPollInterval, args); 
};
