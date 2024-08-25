## [Unreleased]

## [0.0.1]

### Added

- The extension with its core functionality of storing clipboard items.

## [0.1.0]

### Added

- Configurable settings for:
  - Number of clipboard items stored
  - Poll interval of system clipboard
  - Trigger character used, for seeing completions.
- Tests for:
  - Clipboard items limit
  - Reduction of clipboard items limit, while extension is running.

### Removed

- VSCode information bubbles, used for the purpose of debugging.

## [0.1.1]

### Changed

- Name of extension

## [1.0.0]

### Added

- Clipboard event change detection scripts for all OS.

### Removed

- Polling of clipboard to check for new items.
- `clipboardPollInterval` property from extension contribution points.

## [1.1.0]

## Added

- Test for seeing if hotkeys are working as expected.
- `clearClipboard` command for clearing the clipboard.

## [1.2.0]

### Added

- Browser version of the extension.
- Proper configurations for `.vscode/launch.json` and `.vscode/tasks.json`
- Notification for verifying that the extension is up and running.
- `clipboardPollInterval` property into contribution points.

## [1.3.0]

### Added

- Some amount of error handling for browser version of extension.

## [1.4.0]

### Added

- Demo GIFs that show how to use the extension.

### Changed 

- Look of the icon of the extension.