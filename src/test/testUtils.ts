import * as vscode from 'vscode';
import {
  EXTENSION_NAME, 
  ExtensionType
} from '../constants';

export async function waitForDelay(milliSeconds: number): Promise<boolean> {
  return new Promise((resolve) => setTimeout(resolve, milliSeconds, true));
}

export const writeTextToClipboard: {
  [extensionType in ExtensionType]: (text: string) => Promise<void>;
} = {
  browser: async function writeTextToClipboardForBrowser(text: string): Promise<void> {
    const {
      clipboardPollInterval
    } = vscode.workspace.getConfiguration(EXTENSION_NAME);
  
    await vscode.env.clipboard.writeText(text);
    // Allow the clipboard to be polled and read.
    await waitForDelay(clipboardPollInterval * 2);
  },
  main: async function writeTextToClipboard(text: string): Promise<void> {
    await vscode.env.clipboard.writeText(text);
    // Wait for 100 milliseconds, to prevent race condition between clipboard write and read in the change event
    await waitForDelay(100);
  },
};

export const writeNNumbersToClipboardOneByOne: {
  [extensionType in ExtensionType]: (n: number) => Promise<void>;
} = {
  browser: async function writeNNumbersToClipboardOneByOneForBrowser(
    n: number
  ): Promise<void> {
    const {
      clipboardPollInterval
    } = vscode.workspace.getConfiguration(EXTENSION_NAME);
  
    while(n > 0) {
      await writeTextToClipboard.browser(n.toString());
      // Allow the clipboard to be polled and read.
      await waitForDelay(clipboardPollInterval * 2);
      n--;
    };
  },
  main: async function writeNNumbersToClipboardOneByOne(
    n: number
  ): Promise<void> {
    while(n > 0) {
      await writeTextToClipboard.main(n.toString());
      n--;
    };
  }
};

export async function getUntitledEditor() {
  const uri = vscode.Uri.parse('untitled:./test.txt', true);
  const mockDocument = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(mockDocument);

  return {
    editor,
    mockDocument, 
    uri, 
  };
}

export async function getCompletionItemsList() {
  // Create a mock document
  const {
    uri, 
  } = await getUntitledEditor();

  // Trigger the completion provider.
  const position = new vscode.Position(0, 0);
    
  const {
    triggerCharacter 
  } = vscode.workspace.getConfiguration(EXTENSION_NAME);

  const completionList = await vscode.commands.executeCommand<vscode.CompletionList>(
    'vscode.executeCompletionItemProvider',
    uri,
    position,
    triggerCharacter
  );

  return {
    completionItemsList: completionList.items.map((item) => item.insertText ?? item.label), 
    completionList,
  };
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