// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	/* 
	* Use the console to output diagnostic information (console.log) and errors (console.error)
	* This line of code will only be executed once when your extension is activated
	*/
	// console.log('Congratulations, your extension "clippy" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable : vscode.Disposable = vscode.commands.registerCommand(
		'clippy.helloWorld', 
		() => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Clippy!');
		}
	);

	/* 
	This has nothing to do with the functioning of the command.
	It just ensures that once the extension is de-activated, the command is disposed of as well.
	*/
	context.subscriptions.push(disposable);
	
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

				const simpleCompletion = new vscode.CompletionItem('Hello World!');
				// simpleCompletion.detail = "sample";
				// simpleCompletion.filterText = "test";
				// simpleCompletion.insertText = "blablabla";
				// simpleCompletion.label = "test";
				return [
					simpleCompletion,
					...completionItems
				];
			}
		},
		// This is the trigger character
		'%'
	);

	context.subscriptions.push(provider);

	// This variable will be available to the command handler below, since a closure is formed.
	let previousClipboardContent: string = '';

	function checkClipboard() {
        vscode.env.clipboard.readText().then((text) => {
            const clipboardContent: string = text;

            if (clipboardContent !== previousClipboardContent) {
                vscode.window.showInformationMessage(clipboardContent);
				
				// Creating a completion item using the new clipboard content.
				const completionItem: vscode.CompletionItem = new vscode.CompletionItem(clipboardContent);
				
				completionItems.push(completionItem);
				console.log(completionItems);
            }

            previousClipboardContent = clipboardContent;

            setTimeout(checkClipboard, 100); // Schedule the next check after the specified delay
        });
	};
	
	checkClipboard();
	
}

// This method is called when your extension is deactivated
export function deactivate() {}
