import * as vscode from 'vscode';
import {
  EXTENSION_NAME 
} from '../constants';

export async function writeNNumbersToClipboardOneByOne(
  n: number
) {
  return new Promise(async (resolve, reject) => {
    while(n > 0) {
      await vscode.env.clipboard.writeText(n.toString());
      n--;
    }

    resolve(true);
  });
}

export async function getCompletionItemsList() {
  // Create a mock document
  const uri = vscode.Uri.parse('untitled:./test.txt', true);
  const mockDocument = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(mockDocument);

  // Trigger the completion provider.
  const position = new vscode.Position(0, 0);
    
  const {
    triggerCharacter 
  } = vscode.workspace.getConfiguration(EXTENSION_NAME);

  return vscode.commands.executeCommand<vscode.CompletionList>(
    'vscode.executeCompletionItemProvider',
    uri,
    position,
    triggerCharacter
  );
}

export function updateWorkspaceVariableValue<T>(propertyName: string, propertyValue: T): Thenable<void> {
  const workspaceConfig = vscode.workspace.getConfiguration(EXTENSION_NAME);

  // We write to global configuration, because an actual workspace is not open, during the test.
  const configurationTarget = vscode.ConfigurationTarget.Global;

  return workspaceConfig.update(
    propertyName,
    propertyValue,
    configurationTarget,
    false
  );
}