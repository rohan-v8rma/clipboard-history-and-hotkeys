const esbuild = require('esbuild');
const glob = require('glob');
const path = require('path');
const {
  polyfillNode 
} = require("esbuild-plugin-polyfill-node");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const mainBuildOptions = {
    bundle: true,
    entryPoints: [
      'src/main/extension.ts',
    ],
    external: ['vscode'],
    format: 'cjs',
    logLevel: 'silent',
    minify: production,
    outdir: 'out/main',
    // outfile: 'out/main/extension.js',
    platform: 'node',
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin
    ],
    sourcemap: !production,
    sourcesContent: false,
  };

  const mainTestBuildOptions = {
    ...mainBuildOptions,
    entryPoints: [
      'src/test/main/extensionTests.ts'
    ],
    outdir: undefined,
    outfile: 'out/test/main/extensionTests.js',
    // Node.js global to browser globalThis
    plugins: [
      getTestBundlePlugin('main'),
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
  };

  const browserBuildOptions = {
    bundle: true,
    entryPoints: [
      'src/browser/extension.ts',
    ],
    external: ['vscode'],
    format: 'cjs',
    logLevel: 'silent',
    minify: production,
    outdir: 'out/browser',
    // outfile: 'out/browser/extension.js',
    platform: 'browser',
    plugins: [
      polyfillNode({
        globals: {
          navigator: true,
        }
      }),
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
    sourcemap: !production,
    sourcesContent: false,
  };

  const browserTestBuildOptions = {
    ...browserBuildOptions,
    entryPoints: [
      'src/test/browser/extensionTests.ts'
    ],
    outdir: undefined,
    outfile: 'out/test/browser/extensionTests.js',
    plugins: [
      polyfillNode({
        globals: {
          navigator: true,
        }
      }),
      getTestBundlePlugin('browser'),
      esbuildProblemMatcherPlugin
    ]
  };

  Promise.all([
    esbuild.build({
      ...mainBuildOptions,
      watch: watch
    }),
    // esbuild.build({
    //   ...mainTestBuildOptions,
    //   watch: watch
    // }),
    esbuild.build({
      ...browserTestBuildOptions,
      watch: watch
    }),
    esbuild.build({
      ...browserBuildOptions,
      watch: watch
    }),
  ]);
}

const getTestBundlePlugin = (
  extensionType
) => {
  /**
  * For web extension, all tests, including the test runner, need to be bundled into
  * a single module that has an exported `run` function.
  * This plugin implements a virtual file extensionTests.ts that bundles all these together.
  * @type {import('esbuild').Plugin}
  */
  return {
    name: 'testBundlePlugin',
    setup(build) {
      // This function is called when esbuild is setting up the build process
  
      // This hook is triggered when resolving a module with the file name 'extensionTests.ts'
      build.onResolve({
        filter: /[\/\\]extensionTests\.ts$/ 
      }, args => {
        // If the module is an entry point, return the resolved path of the file
        if (args.kind === 'entry-point') {
          return {
            path: path.resolve(args.path) 
          };
        }
      });
      
      // This hook is triggered when loading a module with the file name 'extensionTests.ts'
      build.onLoad({
        filter: /[\/\\]extensionTests\.ts$/ 
      }, async (args) => {
        // Define the root directory where the tests are located
        const testsRoot = path.join(__dirname, `src/test/${extensionType}`);

        // Use the glob package to find all test files with the pattern '*.test.{ts,tsx}'
        const files = await glob.glob('*.test.{ts,tsx}', {
          cwd: testsRoot, posix: true 
        });

        return {
          contents: (
            `export { run } from '../mochaTestRunner.ts';` 
            + files.map(f => `import('./${f}');`).join('')
          ),
          watchDirs: files.map(f => path.dirname(path.resolve(testsRoot, f))),
          watchFiles: files.map(f => path.resolve(testsRoot, f))
        };
    
      });
    }
  };
};

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',
  
  setup(build) {
    build.onStart(() => {
      console.log('[watch] build started');
    });
    build.onEnd(result => {
      result.errors.forEach(({
        text, location 
      }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(`    ${location.file}:${location.line}:${location.column}:`);
      });
      console.log('[watch] build finished');
    });
  }
};
  
main().catch(e => {
  console.error(e);
  process.exit(1);
});