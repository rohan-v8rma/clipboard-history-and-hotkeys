#  Clipboard History & Hotkeys

An extension that lets you access previous clipboard items using shortcuts and completion prompts inside the editor.

## Features

- While in an open file in the editor, press the `%` prompt key (this key is configurable) to see the available keyboard items.
- If you know which clipboard item you want, use the shortcut `Ctrl+Shift+[1-9]`, depending on which one you need.
  - `Ctrl+Shift+1` gets the last copied item.
  - `Ctrl+Shift+9` gets the 9th last copied item.

<!-- Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\) -->

<!-- > Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

<!-- ## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them. -->

## Extension Settings

This extension contributes the following settings:

- `clipboard-history-and-hotkeys.clipboardPollInterval`: The intervals (in `ms`) at which the extension checks for new content in the clipboard. The minimum possible value is `4ms` due to limitations of the Web API. Note that this is an approximate figure.
- `clipboard-history-and-hotkeys.numberOfClipboardItems`: The number of clipboard items to store. Default value of `10` ensures all paste keybinds are functional.
- `clipboard-history-and-hotkeys.triggerCharacter`: The character that needs to be typed, to trigger the completion dropdown.

<!-- ## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

# dev guidelines

- Read [this](https://code.visualstudio.com/api/references/activation-events#onStartupFinished) link to understand why `onStartupFinished` is used as an `activationEvent`. -->