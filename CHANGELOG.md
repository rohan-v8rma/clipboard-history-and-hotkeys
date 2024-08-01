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

## [1.0.0]

### Added

- Clipboard event change detection scripts for all OS.

### Removed

- Polling of clipboard to check for new items.