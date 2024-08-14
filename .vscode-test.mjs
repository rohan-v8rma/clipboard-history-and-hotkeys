import { defineConfig } from '@vscode/test-cli';

const EXTENSION_TYPE_MAP = {
  browser: 'browser',
  main: 'main',
}

export default defineConfig([
  {
    label: EXTENSION_TYPE_MAP.browser,
    // Required: Glob of files to load (can be an array and include absolute paths).
    files: `out/test/${EXTENSION_TYPE_MAP.browser}/**/*.test.js`,
    // Optional: Root path of your extension, same as the API above, defaults
    // to the directory this config file is in
    // extensionDevelopmentPath: __dirname,
    // Optional: sample workspace to open
    // workspaceFolder: `${__dirname}/sampleWorkspace`,
    launchArgs: [
        '--extensionTestsPath=./out/test/browser/extensionTests.js',
    ]
  },
  {
    label: EXTENSION_TYPE_MAP.main,
    // Required: Glob of files to load (can be an array and include absolute paths).
    files: `out/test/${EXTENSION_TYPE_MAP.main}/**/*.test.js`,
    // Optional: Root path of your extension, same as the API above, defaults
    // to the directory this config file is in
    // extensionDevelopmentPath: __dirname,
    // Optional: sample workspace to open
    // workspaceFolder: `${__dirname}/sampleWorkspace`,
    launchArgs: [
        '--extensionTestsPath=./out/test/main/extensionTests.js',
    ]
  },
  // you can specify additional test configurations if necessary
]);