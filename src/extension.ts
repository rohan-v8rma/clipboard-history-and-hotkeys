// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { pollClipboard } from './utils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	/* 
	* Use the console to output diagnostic information (console.log) and errors (console.error)
	* This line of code will only be executed once when your extension is activated
	*/
	// console.log('Congratulations, your extension "log-copypluspaste" is now active!');

	/*
	? An alternative method for debugging. 
	TODO: Refer https://stackoverflow.com/questions/34085330/how-to-write-to-log-from-vscode-extension
	*/
	// const outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("Log(Copy + Paste)");
	// outputChannel.show();
	// outputChannel.appendLine("Debugging");


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable : vscode.Disposable = vscode.commands.registerCommand(
		'log-copypluspaste.helloWorld', 
		() => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Log(Copy + Paste)!');
		}
	);

	/* 
	This has nothing to do with the functioning of the command.
	It just ensures that once the extension is de-activated, the command is disposed of as well.
	*/
	context.subscriptions.push(disposable);
	

	//* The array that will be storing our clipboard items.
	let completionItems: vscode.CompletionItem[] = [];


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
				This is used to get the position of the % sign.
				
				We do this so that when a completion item is selected, the % sign is replaced by the 
				completion item.
				*/
				const prevPosition: vscode.Position = new vscode.Position(
					// We do this, to prevent invalid positions, as positions start from 0.
					Math.max(position.line, 0), 
					Math.max(position.character - 1, 0) 
				);

				completionItems.forEach((completionItem: vscode.CompletionItem, index: number) => {
					completionItem.additionalTextEdits = [
						// This removes the % sign, irrespective of the completion item selected.
						vscode.TextEdit.delete(new vscode.Range(prevPosition, position))
					];

					// TODO: Optional Feature
					// completionItem.label = (index + 1).toString() + ". "+ completionItem.label;
				});


				return completionItems;
			}
		},
		// This is the trigger character
		'%'
	);

	context.subscriptions.push(provider);

	//* Command for pasting the items in clipboard directly, using keybind.
	disposable = vscode.commands.registerCommand(
		'log-copypluspaste.fetchItem',
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
					completionItems[itemNum - 1] 
					? 
					/* 
					If `insertText` is NOT undefined (checked using non-nullish coalescing operator), it means the `label` is different from the actual text. In that case, we use the `insertText`	property which holds the actual text that needs to be copied.

					If `insertText` is undefined, it is because the `label` has NOT been changed and is the same as the actual text that needs to be copied. So, we just use the `label` property to get the text we need.
					*/
					completionItems[itemNum - 1].insertText ?? 
					completionItems[itemNum - 1].label
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
		}
	);

	context.subscriptions.push(disposable);

	// This variable will be available to the command handler below, since a closure is formed.
	let previousClipboardContent: string = '';
	
	pollClipboard(previousClipboardContent, completionItems);
}

// This method is called when your extension is deactivated
export function deactivate() {}
