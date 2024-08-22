export default {};

export const EXTENSION_NAME = 'clipboard-history-and-hotkeys';

export const EXTENSION_NOTIFICATION = 'Clipboard History & Hotkeys 📋 is now running!';

export const WEB_EXTENSION_NOTIFICATION = `Web version of ${EXTENSION_NOTIFICATION}`;

export const EXTENSION_TYPE_MAP = {
  browser: 'browser',
  main: 'main',
};

export type ExtensionType = keyof typeof EXTENSION_TYPE_MAP;