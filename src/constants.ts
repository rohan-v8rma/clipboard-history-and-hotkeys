export default {};

export const EXTENSION_NAME = 'clipboard-history-and-hotkeys';

export const EXTENSION_TYPE_MAP = {
  browser: 'browser',
  main: 'main',
};

export type ExtensionType = keyof typeof EXTENSION_TYPE_MAP;