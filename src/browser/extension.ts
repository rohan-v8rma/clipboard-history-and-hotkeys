// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

import * as vscode from 'vscode';

import {
  correctCompletionItemsLength,
  createCompletionItem,
  pollClipboard 
} from '../utils';

import {
  EXTENSION_NAME 
} from '../constants';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  const {
    triggerCharacter
  } = vscode.workspace.getConfiguration(EXTENSION_NAME);

  const initialClipboardValue: string = await vscode.env.clipboard.readText();

  //* The array that will be storing our clipboard items.
  const args: {
    completionItems: vscode.CompletionItem[]
  } = {
    completionItems: (
      initialClipboardValue 
        ? [createCompletionItem(initialClipboardValue)]
        : []
    )
  };


  //* Registering the completion provider
  let provider : vscode.Disposable = vscode.languages.registerCompletionItemProvider(
    /* 
		This is for making the completion provider available in all files. 
		TODO: Refer https://code.visualstudio.com/api/references/document-selector
		*/
    // [
    // 	{pattern: '**', scheme: 'file'}, 
    // 	{pattern: '**', scheme:'untitled'}
    // ],
    '*',
    {
      provideCompletionItems(
        document: vscode.TextDocument, 
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ) {					
        /* 
				This is used to get the position of the TRIGGER CHARACTER
				
				We do this so that when a completion item is selected, the TRIGGER CHARACTER is replaced by the 
				completion item.
				*/
        const prevPosition: vscode.Position = new vscode.Position(
          // We do this, to prevent invalid positions, as positions start from 0.
          Math.max(position.line, 0), 
          Math.max(position.character - triggerCharacter.length, 0) 
        );

        return args.completionItems
          .map(
            (completionItem: vscode.CompletionItem)
            : vscode.CompletionItem => ({
              ...completionItem,
              additionalTextEdits: [
              // This removes the TRIGGER CHARACTER, irrespective of the completion item selected.
                vscode.TextEdit.delete(new vscode.Range(prevPosition, position))
              ],
            })
          );
      }
    },
    // This is the trigger character
    triggerCharacter
  );

  context.subscriptions.push(provider);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  //* Command for pasting the items in clipboard directly, using keybind.
  let disposable = vscode.commands.registerCommand(
    `${EXTENSION_NAME}.fetchItem`,
    (itemNum: number) => {
      const editor = vscode.window.activeTextEditor;

      /* 
			There is surely to be an active text editor, because this command is only executed
			when "editorTextFocus".

			But, we still need to perform an optional chaining, to avoid typescript errors.
			*/
      editor?.edit(editBuilder => {
					
        const textToBeInserted: string = String(
          /*
					Ternary expression that checks if a particular index in the completion items array is undefined or NOT. 
					
					If not, we choose either the `insertText` or `label` property as the text that is to be inserted.

					If it is undefined, we keep "NO SUCH ITEM" as the text to be inserted.
					*/
          args.completionItems[itemNum - 1] 
            /* 
            If `insertText` is NOT undefined (checked using non-nullish coalescing operator), it means the `label` is different from the actual text. In that case, we use the `insertText`	property which holds the actual text that needs to be copied.

            If `insertText` is undefined, it is because the `label` has NOT been changed and is the same as the actual text that needs to be copied. So, we just use the `label` property to get the text we need.
            */
            ? (
              args.completionItems[itemNum - 1].insertText 
              ?? args.completionItems[itemNum - 1].label
            )
            :
            "NO SUCH ITEM"
        );
				

        editBuilder.insert(
          editor.selection.active, 
          /* 
					Even though we have checked that the property is not undefined;

					We still use the String constructor, to surpass the typescript error,
					which doesn't allow assignment of a property that might be undefined
					to a String parameter.
					*/
          textToBeInserted
        );
      });

      // We are returning the item, so that we can test it.
      return args.completionItems[itemNum - 1];
    }
  );

  // This is for updating the completion items, when the configuration changes.
  disposable = vscode.workspace.onDidChangeConfiguration(event => {
    correctCompletionItemsLength(
      args.completionItems, 
      vscode
        .workspace
        .getConfiguration(EXTENSION_NAME)
        .numberOfClipboardItems
    );
  });

  context.subscriptions.push(disposable);


  // Command for clearing the clipboard items as well as the clipboard.
  disposable = vscode.commands.registerCommand(
    `${EXTENSION_NAME}.clearClipboard`,
    async () => {
      await vscode.env.clipboard.writeText("");
      args.completionItems = [];
    }
  );

  context.subscriptions.push(disposable);

  pollClipboard(args);
}

// This method is called when your extension is deactivated
export function deactivate() {
}
